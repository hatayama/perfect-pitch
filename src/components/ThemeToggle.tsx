interface ThemeToggleProps {
  readonly theme: "dark" | "light";
  readonly onToggle: () => void;
}

function SunIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" fill="currentColor" />
      <path
        d="M12 2.5V5M12 19V21.5M21.5 12H19M5 12H2.5M18.7 5.3L16.9 7.1M7.1 16.9L5.3 18.7M18.7 18.7L16.9 16.9M7.1 7.1L5.3 5.3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14.5 3.2C11 4 8.4 7.2 8.4 11C8.4 15.4 12 19 16.4 19C17.8 19 19.1 18.6 20.2 17.9C19 20.2 16.5 21.8 13.7 21.8C9.3 21.8 5.7 18.2 5.7 13.8C5.7 9.9 8.5 6.6 12.2 5.9C12.9 5.8 13.8 5.7 14.5 3.2Z"
        fill="currentColor"
        stroke="var(--theme-icon-contrast)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={theme === "dark" ? "ライトモードに切り替え" : "ダークモードに切り替え"}
    >
      <span className="theme-toggle__icon">
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </span>
    </button>
  );
}
