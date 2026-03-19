import { useCallback, useMemo, useState } from "react";
import type { ChordDefinition } from "../constants/chords";
import { useQuizFlow } from "../hooks/useQuizFlow";
import { buildChoices } from "../utils/buildChoices";
import { PianoKeyboard } from "./PianoKeyboard";
import { AnswerPanel } from "./AnswerPanel";
import { BackButton } from "./BackButton";
import { Feedback } from "./Feedback";

interface PianoPlayModeProps {
  readonly enabledChords: readonly ChordDefinition[];
  readonly onBack: () => void;
}

type Phase = "showKeyboard" | "waitAnswer";

export function PianoPlayMode({ enabledChords, onBack }: PianoPlayModeProps) {
  const choices: readonly ChordDefinition[] = useMemo(
    () => buildChoices(enabledChords),
    [enabledChords],
  );
  const [phase, setPhase] = useState<Phase>("showKeyboard");

  const onCorrectComplete = useCallback(() => {
    setPhase("showKeyboard");
  }, []);

  const {
    currentChord,
    feedbackResult,
    revealedId,
    answered,
    handleAnswer,
  } = useQuizFlow(enabledChords, onCorrectComplete);

  const handlePlayed = useCallback(() => {
    setPhase("waitAnswer");
  }, []);

  // 黒(#212121)だと鍵盤のハイライトが見えにくいため、少し明るいグレーを使う
  const highlightColor: string = currentChord.colorHex === "#212121"
    ? "#666"
    : currentChord.colorHex;

  return (
    <div style={{ textAlign: "center", padding: "16px" }}>
      <BackButton onClick={onBack} />

      {phase === "showKeyboard" ? (
        <>
          <h2 style={{ marginTop: "48px", fontSize: "1.4rem", color: "#333" }}>
            この おとを ひいてね
          </h2>

          <div style={{
            margin: "16px auto",
            padding: "12px 24px",
            backgroundColor: currentChord.colorHex,
            color: currentChord.textColor,
            borderRadius: "12px",
            display: "inline-block",
            fontSize: "1.3rem",
            fontWeight: "bold",
          }}>
            {currentChord.colorName} — {currentChord.label}
          </div>

          <div style={{ margin: "24px auto", padding: "0 8px" }}>
            <PianoKeyboard
              highlightNotes={currentChord.notes}
              highlightColor={highlightColor}
            />
          </div>

          <button
            onClick={handlePlayed}
            style={{
              fontSize: "1.5rem",
              padding: "16px 48px",
              borderRadius: "16px",
              border: "none",
              backgroundColor: "#4CAF50",
              color: "#fff",
              cursor: "pointer",
              marginTop: "16px",
              boxShadow: "0 4px 12px rgba(76,175,80,0.3)",
            }}
          >
            ひいたよ！
          </button>
        </>
      ) : (
        <>
          <h2 style={{ marginTop: "48px", fontSize: "1.6rem", color: "#333" }}>
            なんの おと？
          </h2>

          <AnswerPanel
            chords={choices}
            revealedId={revealedId}
            disabled={answered}
            onAnswer={handleAnswer}
          />
        </>
      )}

      <Feedback correct={feedbackResult} />
    </div>
  );
}
