import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "✨ AI 운세 - 사주·타로·꿈해몽·관상 AI 분석",
  description: "AI가 분석하는 사주, 궁합, 타로, 관상, 손금, 꿈해몽, 점성술, 자미두수, 운세, 포춘쿠키. 무료 AI 운세 서비스.",
  keywords: "사주, 궁합, 타로, 관상, 손금, 꿈해몽, 점성술, 자미두수, 운세, AI운세, 무료운세",
  openGraph: {
    title: "AI 운세 - 사주·타로·꿈해몽 AI 분석",
    description: "AI가 분석하는 무료 운세 서비스",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="stars" />
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
        <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
      </body>
    </html>
  );
}
