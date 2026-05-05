import type { ChordDefinition } from "../constants/chords";
import { ChordPianoKeyboard } from "./ChordPianoKeyboard";

interface FeedbackProps {
  readonly correct: boolean | null;
  readonly correctChord: ChordDefinition | null;
  readonly onDismissCorrect: () => void;
}

export function Feedback({ correct, correctChord, onDismissCorrect }: FeedbackProps) {
  if (correct === null) {
    return null;
  }

  const dismissable: boolean = correct;

  return (
    <div
      role={dismissable ? "button" : undefined}
      tabIndex={dismissable ? 0 : undefined}
      aria-label={dismissable ? "正解表示を閉じる" : undefined}
      onClick={dismissable ? onDismissCorrect : undefined}
      onKeyDown={(event) => {
        if (!dismissable) return;
        if (event.key !== "Enter" && event.key !== " ") return;

        event.preventDefault();
        onDismissCorrect();
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        zIndex: 100,
        pointerEvents: dismissable ? "auto" : "none",
        cursor: dismissable ? "pointer" : "default",
        animation: "fadeIn 0.2s ease",
      }}
    >
      {correct ? (
        <div className="feedback__correct">
          <div style={{
            fontSize: "8rem",
            color: "#4CAF50",
            textShadow: "0 4px 20px rgba(76,175,80,0.5)",
            animation: "popIn 0.3s ease",
          }}>
            &#x2B50;
          </div>
          {correctChord !== null ? (
            <div className="feedback__keyboard">
              <ChordPianoKeyboard chord={correctChord} />
            </div>
          ) : null}
        </div>
      ) : (
        <div style={{
          fontSize: "2rem",
          color: "#fff",
          backgroundColor: "rgba(0,0,0,0.7)",
          borderRadius: "20px",
          padding: "24px 32px",
          textAlign: "center",
          animation: "popIn 0.3s ease",
        }}>
          もういちど<br />きいてみよう！
        </div>
      )}
    </div>
  );
}
