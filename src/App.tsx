import { useCallback, useEffect, useState } from "react";
import { useProgress } from "./hooks/useProgress";
import { initSampler } from "./audio/ChordPlayer";
import { HomeScreen } from "./components/HomeScreen";
import { AppPlayMode } from "./components/AppPlayMode";
import { PianoPlayMode } from "./components/PianoPlayMode";

type Screen = "home" | "appPlay" | "pianoPlay";

function App() {
  const { progress, unlockedChords, recordAnswer, resetProgress } = useProgress();
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
          currentLevel={progress.currentLevel}
          unlockedChords={unlockedChords}
          onStartAppMode={() => setScreen("appPlay")}
          onStartPianoMode={() => setScreen("pianoPlay")}
          onReset={resetProgress}
        />
      )}

      {screen === "appPlay" && (
        <AppPlayMode
          unlockedChords={unlockedChords}
          onAnswer={recordAnswer}
          onBack={goHome}
        />
      )}

      {screen === "pianoPlay" && (
        <PianoPlayMode
          unlockedChords={unlockedChords}
          onAnswer={recordAnswer}
          onBack={goHome}
        />
      )}
    </div>
  );
}

export default App;
