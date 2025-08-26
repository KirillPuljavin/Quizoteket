import "@/styles/theme/_bundler.scss";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quizoteket",
  description: "AI-genererad quizplattform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}
