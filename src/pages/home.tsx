import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import { PageLayout } from "../components/PageLayout";
import { HomeScreen } from "../components/HomeScreen";

function HomePage() {
  return (
    <PageLayout>
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
