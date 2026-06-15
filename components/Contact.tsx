"use client";

import { useState } from "react";
import { ContactCard } from "@/components/ui/contact-card";
import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MagicButton from "./ui/MagicButton";
import { FaLocationArrow } from "react-icons/fa6";

type Status =
	| { kind: "idle" }
	| { kind: "sending" }
	| { kind: "success" }
	| { kind: "error"; message: string };

export default function DefaultDemo() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [message, setMessage] = useState("");
	const [status, setStatus] = useState<Status>({ kind: "idle" });

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (status.kind === "sending") return;
		setStatus({ kind: "sending" });

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, phone, message }),
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				setStatus({ kind: "error", message: data?.error ?? "Something went wrong." });
				return;
			}
			setStatus({ kind: "success" });
			setName("");
			setEmail("");
			setPhone("");
			setMessage("");
		} catch {
			setStatus({ kind: "error", message: "Network error. Please try again." });
		}
	}

	const sending = status.kind === "sending";

	return (
		<main className="relative flex flex-col size-full w-full items-center justify-center p-4">
			<div className="mx-auto max-w-5xl">
				<ContactCard
					title="Get in touch"
					description="Want to discuss a role, collaboration, or just talk engineering? I usually reply within 24 hours."
					contactInfo={[
						{
							icon: MailIcon,
							label: "Email",
							value: "technura7@gmail.com",
						},
						{
							icon: PhoneIcon,
							label: "Phone",
							value: "+250 799 373 450",
						},
						{
							icon: MapPinIcon,
							label: "Address",
							value: "Kigali, CHIC",
						},
					]}
				>
					<form onSubmit={handleSubmit} className="w-full space-y-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="contact-name">Name</Label>
							<Input
								id="contact-name"
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								disabled={sending}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="contact-email">Email</Label>
							<Input
								id="contact-email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								disabled={sending}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="contact-phone">Phone</Label>
							<Input
								id="contact-phone"
								type="tel"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								disabled={sending}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="contact-message">Message</Label>
							<Textarea
								id="contact-message"
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								required
								disabled={sending}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<MagicButton
								type="submit"
								disabled={sending}
								title={sending ? "Sending..." : "Let's get in touch"}
								icon={<FaLocationArrow />}
								position="right"
							/>
							{status.kind === "success" && (
								<p className="text-sm text-green-500">
									Thanks! Your message has been sent.
								</p>
							)}
							{status.kind === "error" && (
								<p className="text-sm text-red-500">{status.message}</p>
							)}
						</div>
					</form>
				</ContactCard>
			</div>
		</main>
	);
}
