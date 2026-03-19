import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import { useEnabledChords } from "../hooks/useEnabledChords";
import { initSampler } from "../audio/ChordPlayer";
import { PageLayout } from "../components/PageLayout";
import { PianoPlayMode } from "../components/PianoPlayMode";

function PianoPlayPage() {
  const { enabledChords } = useEnabledChords();

  useEffect(() => {
    initSampler();
  }, []);

  return (
    <PageLayout>
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
