// File: src/app/layout.tsx
import "@/styles/theme/_bundler.scss";
import type { Metadata } from "next";
import Wrapper from "@/components/Wrapper";

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
      <body>
        <Wrapper>{children}</Wrapper>
      </body>
    </html>
  );
}
