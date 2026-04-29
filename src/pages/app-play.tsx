import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import { useEnabledChords } from "../hooks/useEnabledChords";
import { useTheme } from "../hooks/useTheme";
import { initSampler } from "../audio/ChordPlayer";
import { PageLayout } from "../components/PageLayout";
import { AppPlayMode } from "../components/AppPlayMode";
import { ThemeToggle } from "../components/ThemeToggle";

function AppPlayPage() {
  const { enabledChords } = useEnabledChords();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.classList.add("app-play-scroll-lock");

    return () => {
      document.body.classList.remove("app-play-scroll-lock");
    };
  }, []);

  useEffect(() => {
    initSampler();
  }, []);

  return (
    <PageLayout disableScroll>
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <AppPlayMode
        enabledChords={enabledChords}
        onBack={() => { window.location.href = "../"; }}
      />
    </PageLayout>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppPlayPage />
  </StrictMode>,
);
