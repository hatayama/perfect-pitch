import { useCallback, useEffect } from "react";
import { useEnabledChords } from "./hooks/useEnabledChords";
import { useHashRouter } from "./hooks/useHashRouter";
import { initSampler } from "./audio/ChordPlayer";
import { HomeScreen } from "./components/HomeScreen";
import { AppPlayMode } from "./components/AppPlayMode";
import { PianoPlayMode } from "./components/PianoPlayMode";
import { AuthGate } from "./components/AuthGate";
import { SettingsScreen } from "./components/SettingsScreen";

function App() {
  const { enabledChords, enabledChordIds, toggleChord, resetToDefault } = useEnabledChords();
  const { route, navigate } = useHashRouter();

  useEffect(() => {
    initSampler();
  }, []);

  const goHome = useCallback(() => {
    navigate("home");
  }, [navigate]);

  return (
    <div style={{
      minHeight: "100dvh",
      backgroundColor: "#FAFAFA",
      fontFamily: "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
    }}>
      {route === "home" && (
        <HomeScreen
          onStartAppMode={() => navigate("app-play")}
          onStartPianoMode={() => navigate("piano-play")}
          onOpenSettings={() => navigate("auth")}
        />
      )}

      {route === "app-play" && (
        <AppPlayMode
          enabledChords={enabledChords}
          onBack={goHome}
        />
      )}

      {route === "piano-play" && (
        <PianoPlayMode
          enabledChords={enabledChords}
          onBack={goHome}
        />
      )}

      {route === "auth" && (
        <AuthGate
          onSuccess={() => navigate("settings")}
          onCancel={goHome}
        />
      )}

      {route === "settings" && (
        <SettingsScreen
          enabledChordIds={enabledChordIds}
          onToggleChord={toggleChord}
          onResetToDefault={resetToDefault}
          onBack={goHome}
        />
      )}
    </div>
  );
}

export default App;
