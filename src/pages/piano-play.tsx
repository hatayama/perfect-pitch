import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import { useTheme } from "../hooks/useTheme";
import { PageLayout } from "../components/PageLayout";
import { PianoPlayMode } from "../components/PianoPlayMode";
import { ThemeToggle } from "../components/ThemeToggle";

function PianoPlayPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <PageLayout>
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <PianoPlayMode onBack={() => { window.location.href = "../"; }} />
    </PageLayout>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PianoPlayPage />
  </StrictMode>,
);
