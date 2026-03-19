import { useCallback, useEffect, useState } from "react";
import { useEnabledChords } from "./hooks/useEnabledChords";
import { initSampler } from "./audio/ChordPlayer";
import { HomeScreen } from "./components/HomeScreen";
import { AppPlayMode } from "./components/AppPlayMode";
import { PianoPlayMode } from "./components/PianoPlayMode";
import { AuthGate } from "./components/AuthGate";
import { SettingsScreen } from "./components/SettingsScreen";

type Screen = "home" | "appPlay" | "pianoPlay" | "authGate" | "settings";

function App() {
  const { enabledChords, enabledChordIds, toggleChord, resetToDefault } = useEnabledChords();
  const [screen, setScreen] = useState<Screen>("home");

  useEffect(() => {
    initSampler();
  }, []);

  const goHome = useCallback(() => {
    setScreen("home");
  }, []);

  return (
    <div style={{
      minHeight: "100dvh",
      backgroundColor: "#FAFAFA",
      fontFamily: "'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif",
    }}>
      {screen === "home" && (
        <HomeScreen
          onStartAppMode={() => setScreen("appPlay")}
          onStartPianoMode={() => setScreen("pianoPlay")}
          onOpenSettings={() => setScreen("authGate")}
        />
      )}

      {screen === "appPlay" && (
        <AppPlayMode
          enabledChords={enabledChords}
          onBack={goHome}
        />
      )}

      {screen === "pianoPlay" && (
        <PianoPlayMode
          enabledChords={enabledChords}
          onBack={goHome}
        />
      )}

      {screen === "authGate" && (
        <AuthGate
          onSuccess={() => setScreen("settings")}
          onCancel={goHome}
        />
      )}

      {screen === "settings" && (
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
