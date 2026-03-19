import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import { useEnabledChords } from "../hooks/useEnabledChords";
import { initSampler } from "../audio/ChordPlayer";
import { PageLayout } from "../components/PageLayout";
import { AppPlayMode } from "../components/AppPlayMode";

function AppPlayPage() {
  const { enabledChords } = useEnabledChords();

  useEffect(() => {
    initSampler();
  }, []);

  return (
    <PageLayout>
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
