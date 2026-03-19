import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChordDefinition } from "../constants/chords";
import { playChord, initSampler } from "../audio/ChordPlayer";
import { useQuizFlow } from "../hooks/useQuizFlow";
import { buildChoices } from "../utils/buildChoices";
import { AnswerPanel } from "./AnswerPanel";
import { BackButton } from "./BackButton";
import { Feedback } from "./Feedback";

interface AppPlayModeProps {
  readonly enabledChords: readonly ChordDefinition[];
  readonly onBack: () => void;
}

export function AppPlayMode({ enabledChords, onBack }: AppPlayModeProps) {
  const {
    currentChord,
    feedbackResult,
    revealedId,
    answered,
    handleAnswer,
  } = useQuizFlow(enabledChords);

  const choices: readonly ChordDefinition[] = useMemo(
    () => buildChoices(enabledChords),
    [enabledChords],
  );
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    initSampler().then(() => setReady(true));
  }, []);

  const handlePlay = useCallback(() => {
    playChord(currentChord.notes);
  }, [currentChord]);

  return (
    <div style={{ textAlign: "center", padding: "16px" }}>
      <BackButton onClick={onBack} />

      <h2 style={{ marginTop: "48px", fontSize: "1.6rem", color: "#e0e0e0" }}>
        きいてみよう！
      </h2>

      <button
        onClick={handlePlay}
        disabled={!ready}
        style={{
          fontSize: "2rem",
          padding: "20px 48px",
          borderRadius: "50%",
          border: "none",
          backgroundColor: ready ? "#546E7A" : "#444",
          color: "#fff",
          cursor: ready ? "pointer" : "default",
          margin: "16px 0 32px",
          width: "100px",
          height: "100px",
          boxShadow: "0 4px 12px rgba(84,110,122,0.4)",
        }}
      >
        {ready ? "♪" : "..."}
      </button>

      <AnswerPanel
        chords={choices}
        revealedId={revealedId}
        disabled={answered}
        onAnswer={handleAnswer}
      />

      <Feedback correct={feedbackResult} />
    </div>
  );
}
