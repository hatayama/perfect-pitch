import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import { useEnabledChords } from "../hooks/useEnabledChords";
import { useTheme } from "../hooks/useTheme";
import { PageLayout } from "../components/PageLayout";
import { AuthGate } from "../components/AuthGate";
import { SettingsScreen } from "../components/SettingsScreen";
import { ThemeToggle } from "../components/ThemeToggle";

function SettingsPage() {
  const { enabledChordIds, toggleChord, resetToDefault } = useEnabledChords();
  const { theme, toggleTheme } = useTheme();
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const goHome = () => { window.location.href = "../"; };

  return (
    <PageLayout>
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      {authenticated ? (
        <SettingsScreen
          enabledChordIds={enabledChordIds}
          onToggleChord={toggleChord}
          onResetToDefault={resetToDefault}
          onBack={goHome}
        />
      ) : (
        <AuthGate
          onSuccess={() => setAuthenticated(true)}
          onCancel={goHome}
        />
      )}
    </PageLayout>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SettingsPage />
  </StrictMode>,
);
