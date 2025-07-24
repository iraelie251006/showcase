import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Niyubwayo Irakoze Elie | Software Engineer",
  description: "I'm Niyubwayo Irakoze Elie, a passionate Software Engineer from Rwanda, skilled in building scalable web applications using modern technologies like Next.js, Express.js, TypeScript, and PostgreSQL.",
};

export const openGraph = {
  title: "Niyubwayo Irakoze Elie | Software Engineer",
  description: "I'm Niyubwayo Irakoze Elie, a passionate Software Engineer from Rwanda, skilled in building scalable web applications using modern technologies like Next.js, Express.js, TypeScript, and PostgreSQL.",
  url: "https://iraelie.vercel.app",
  siteName: "Niyubwayo Irakoze Elie",
  images: [
    {
      url: "/Elie.jpeg",
      width: 1200,
      height: 630,
      alt: "Niyubwayo Irakoze Elie | Software Engineer",
    },
  ],
};
// add twitter metadata
export const twitter = {
  title: "Niyubwayo Irakoze Elie | Software Engineer",
  description: "I'm Niyubwayo Irakoze Elie, a passionate Software Engineer from Rwanda, skilled in building scalable web applications using modern technologies like Next.js, Express.js, TypeScript, and PostgreSQL.",
  card: "summary_large_image",
  site: "@iraelie251006",
  creator: "@iraelie251006",
  images: [
    {
      url: "/Elie.jpeg",
      width: 1200,
      height: 630,
      alt: "Niyubwayo Irakoze Elie | Software Engineer",
    },
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
