import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import { useTheme } from "../hooks/useTheme";
import { PageLayout } from "../components/PageLayout";
import { HomeScreen } from "../components/HomeScreen";
import { ThemeToggle } from "../components/ThemeToggle";

function HomePage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <PageLayout>
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <HomeScreen
        onStartAppMode={() => { window.location.href = "app-play/"; }}
        onStartPianoMode={() => { window.location.href = "piano-play/"; }}
        onOpenSettings={() => { window.location.href = "settings/"; }}
      />
    </PageLayout>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HomePage />
  </StrictMode>,
);
