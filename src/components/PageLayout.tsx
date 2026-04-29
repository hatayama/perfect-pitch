import type { ReactNode } from "react";

interface PageLayoutProps {
  readonly children: ReactNode;
  readonly disableScroll?: boolean;
}

export function PageLayout({ children, disableScroll = false }: PageLayoutProps) {
  const className: string = disableScroll ? "page-layout page-layout--no-scroll" : "page-layout";

  return (
    <div className={className}>
      {children}
    </div>
  );
}
