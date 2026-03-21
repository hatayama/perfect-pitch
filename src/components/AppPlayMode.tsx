import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChordDefinition } from "../constants/chords";
import { playChord, initSampler, prepareAudioPlayback } from "../audio/ChordPlayer";
import { useQuizFlow } from "../hooks/useQuizFlow";
import { useVolume } from "../hooks/useVolume";
import { buildChoices } from "../utils/buildChoices";
import { AnswerPanel } from "./AnswerPanel";
import { BackButton } from "./BackButton";
import { Feedback } from "./Feedback";
import { VolumeSlider } from "./VolumeSlider";

interface AppPlayModeProps {
  readonly enabledChords: readonly ChordDefinition[];
  readonly onBack: () => void;
}

export function AppPlayMode({ enabledChords, onBack }: AppPlayModeProps) {
  const {
    currentChord,
    feedbackResult,
    revealedId,
    answerDisabled,
    handleAnswer,
    markPromptPlayed,
  } = useQuizFlow(enabledChords);

  const choices: readonly ChordDefinition[] = useMemo(
    () => buildChoices(enabledChords),
    [enabledChords],
  );
  const { volume, updateVolume } = useVolume();
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    initSampler().then(() => setReady(true));
  }, []);

  const handlePlay = useCallback(async () => {
    await playChord(currentChord.notes);
    markPromptPlayed();
  }, [currentChord, markPromptPlayed]);

  return (
    <div style={{ textAlign: "center", padding: "16px" }}>
      <BackButton onClick={onBack} />

      <h2 style={{ marginTop: "48px", fontSize: "1.6rem", color: "var(--text-primary)" }}>
        きいてみよう！
      </h2>

      <button
        onClick={handlePlay}
        onPointerDown={() => {
          void prepareAudioPlayback();
        }}
        disabled={!ready}
        style={{
          fontSize: "2rem",
          padding: "20px 48px",
          borderRadius: "50%",
          border: "none",
          backgroundColor: ready ? "var(--btn-play)" : "var(--bg-disabled)",
          color: "#fff",
          cursor: ready ? "pointer" : "default",
          margin: "16px 0 32px",
          width: "100px",
          height: "100px",
          boxShadow: "0 4px 12px var(--btn-play-shadow)",
        }}
      >
        {ready ? "♪" : "..."}
      </button>

      <VolumeSlider volume={volume} onChangeVolume={updateVolume} />

      <AnswerPanel
        chords={choices}
        revealedId={revealedId}
        disabled={answerDisabled}
        onAnswer={handleAnswer}
      />

      <Feedback correct={feedbackResult} />
    </div>
  );
}
