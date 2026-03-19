interface ThemeToggleProps {
  readonly theme: "dark" | "light";
  readonly onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      style={{
        position: "absolute",
        top: "16px",
        right: "16px",
        fontSize: "1.4rem",
        background: "none",
        border: "none",
        cursor: "pointer",
        lineHeight: 1,
      }}
      aria-label={theme === "dark" ? "ライトモードに切り替え" : "ダークモードに切り替え"}
    >
      {theme === "dark" ? "\u2600\uFE0F" : "\uD83C\uDF19"}
    </button>
  );
}
