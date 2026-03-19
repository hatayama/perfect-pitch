import type { ReactNode } from "react";

interface PageLayoutProps {
  readonly children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div style={{
      minHeight: "100dvh",
      backgroundColor: "#FAFAFA",
      fontFamily: "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
    }}>
      {children}
    </div>
  );
}
