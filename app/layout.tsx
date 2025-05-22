import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ArXiv Summarizer",
  description: "A web app to search and summarize ArXiv papers",
  generator: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
