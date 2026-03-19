import { useCallback, useState } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "perfect-pitch-theme";
const DEFAULT_THEME: Theme = "dark";

function loadTheme(): Theme {
  const stored: string | null = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return DEFAULT_THEME;
}

function applyTheme(theme: Theme): void {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

// 初期ロード時に即座に適用（FLASHを防ぐ）
const initialTheme: Theme = loadTheme();
applyTheme(initialTheme);

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  const toggleTheme = useCallback(() => {
    setTheme((prev: Theme) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
      return next;
    });
  }, []);

  return { theme, toggleTheme } as const;
}
