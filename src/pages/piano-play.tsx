import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import { useEnabledChords } from "../hooks/useEnabledChords";
import { useTheme } from "../hooks/useTheme";
import { initSampler } from "../audio/ChordPlayer";
import { PageLayout } from "../components/PageLayout";
import { PianoPlayMode } from "../components/PianoPlayMode";
import { ThemeToggle } from "../components/ThemeToggle";

function PianoPlayPage() {
  const { enabledChords } = useEnabledChords();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    initSampler();
  }, []);

  return (
    <PageLayout>
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <PianoPlayMode
        enabledChords={enabledChords}
        onBack={() => { window.location.href = "../"; }}
      />
    </PageLayout>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PianoPlayPage />
  </StrictMode>,
);
