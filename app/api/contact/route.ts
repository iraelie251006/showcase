import { NextResponse } from "next/server";
import { Resend } from "resend";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const TO_EMAIL = "niyubwayoiraelie5777@gmail.com";
const FROM_EMAIL = "Portfolio Contact <onboarding@resend.dev>";

const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(3, "1 h"),
        analytics: true,
        prefix: "contact",
      })
    : null;

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "anonymous";
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 }
    );
  }

  if (ratelimit) {
    const ip = getClientIp(req);
    const { success, reset } = await ratelimit.limit(ip);
    if (!success) {
      const retryAfterSec = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
      const retryAfterMin = Math.ceil(retryAfterSec / 60);
      return NextResponse.json(
        {
          error: `Too many messages. Please try again in ${retryAfterMin} minute${
            retryAfterMin === 1 ? "" : "s"
          }.`,
        },
        { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
      );
    }
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const { name, email, phone, message } = (body ?? {}) as Record<string, string>;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    replyTo: email,
    subject: `New portfolio contact from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      "",
      "Message:",
      message,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    const detail =
      process.env.NODE_ENV === "production"
        ? "Failed to send email."
        : `Resend: ${error.name ?? "error"} — ${error.message ?? "unknown"}`;
    return NextResponse.json({ error: detail }, { status: 502 });
  }

  console.log("[contact] sent:", data?.id);
  return NextResponse.json({ ok: true });
}
