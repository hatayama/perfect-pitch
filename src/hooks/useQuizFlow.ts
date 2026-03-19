import { useCallback, useRef, useState } from "react";
import type { ChordDefinition } from "../constants/chords";
import { pickRandomChord } from "../utils/pickRandomChord";

const FEEDBACK_DELAY_CORRECT = 1500;
const FEEDBACK_DELAY_INCORRECT = 2000;

interface QuizFlowResult {
  currentChord: ChordDefinition;
  feedbackResult: boolean | null;
  revealedId: string | null;
  answered: boolean;
  handleAnswer: (selected: ChordDefinition) => void;
  resetForNextRound: () => void;
}

export function useQuizFlow(
  chords: readonly ChordDefinition[],
  onCorrectComplete?: () => void,
): QuizFlowResult {
  const [currentChord, setCurrentChord] = useState<ChordDefinition>(() =>
    pickRandomChord(chords, null)
  );
  const [feedbackResult, setFeedbackResult] = useState<boolean | null>(null);
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const [answered, setAnswered] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPendingTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleAnswer = useCallback((selected: ChordDefinition) => {
    if (answered) return;

    const correct: boolean = selected.id === currentChord.id;
    setAnswered(true);
    setFeedbackResult(correct);

    if (correct) {
      setRevealedId(selected.id);
    }

    clearPendingTimer();
    timerRef.current = setTimeout(() => {
      setFeedbackResult(null);
      if (correct) {
        const next: ChordDefinition = pickRandomChord(chords, currentChord.id);
        setCurrentChord(next);
        setRevealedId(null);
        setAnswered(false);
        onCorrectComplete?.();
      } else {
        setAnswered(false);
      }
    }, correct ? FEEDBACK_DELAY_CORRECT : FEEDBACK_DELAY_INCORRECT);
  }, [answered, currentChord, chords, onCorrectComplete, clearPendingTimer]);

  const resetForNextRound = useCallback(() => {
    clearPendingTimer();
    const next: ChordDefinition = pickRandomChord(chords, currentChord.id);
    setCurrentChord(next);
    setRevealedId(null);
    setAnswered(false);
    setFeedbackResult(null);
  }, [chords, currentChord, clearPendingTimer]);

  return {
    currentChord,
    feedbackResult,
    revealedId,
    answered,
    handleAnswer,
    resetForNextRound,
  };
}
