import type { ReactNode } from "react";

interface PageLayoutProps {
  readonly children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div style={{
      minHeight: "100dvh",
      backgroundColor: "var(--bg-page)",
      fontFamily: "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
    }}>
      {children}
    </div>
  );
}
