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
    feedbackDismissible,
    revealedId,
    answerDisabled,
    handleAnswer,
    markPromptPlayed,
    dismissCorrectFeedback,
    dismissIncorrectFeedback,
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

  const playButtonClassName: string = ready
    ? "app-play-mode__play-button app-play-mode__play-button--ready"
    : "app-play-mode__play-button";

  return (
    <div className="app-play-mode">
      <BackButton onClick={onBack} />

      <h2 className="app-play-mode__title">
        きいてみよう！
      </h2>

      <button
        className={playButtonClassName}
        onClick={handlePlay}
        onPointerDown={() => {
          void prepareAudioPlayback();
        }}
        disabled={!ready}
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

      <Feedback
        correct={feedbackResult}
        dismissible={feedbackDismissible}
        correctChord={feedbackResult === true ? currentChord : null}
        onDismiss={feedbackResult === true ? dismissCorrectFeedback : dismissIncorrectFeedback}
      />
    </div>
  );
}
