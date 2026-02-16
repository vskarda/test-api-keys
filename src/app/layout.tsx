import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gemini API Tester",
  description: "Test your Gemini API keys with text and live chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
