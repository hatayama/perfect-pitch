import { useCallback, useEffect, useRef, useState } from "react";
import type { ChordDefinition } from "../constants/chords";
import { playCorrectSe, playIncorrectSe } from "../audio/ChordPlayer";
import { pickRandomChord } from "../utils/pickRandomChord";

const FEEDBACK_DELAY_CORRECT = 1500;
const FEEDBACK_DELAY_INCORRECT = 2000;
type QuizPhase = "waitingForPrompt" | "readyToAnswer" | "showingCorrect" | "showingIncorrect";

interface QuizFlowResult {
  currentChord: ChordDefinition;
  feedbackResult: boolean | null;
  revealedId: string | null;
  answerDisabled: boolean;
  handleAnswer: (selected: ChordDefinition) => void;
  markPromptPlayed: () => void;
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
  const [phase, setPhase] = useState<QuizPhase>("waitingForPrompt");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPendingTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => clearPendingTimer, [clearPendingTimer]);

  const handleAnswer = useCallback((selected: ChordDefinition) => {
    if (phase !== "readyToAnswer") return;

    const correct: boolean = selected.id === currentChord.id;
    setFeedbackResult(correct);

    if (correct) {
      setRevealedId(selected.id);
      setPhase("showingCorrect");
      void playCorrectSe();
    } else {
      setPhase("showingIncorrect");
      void playIncorrectSe();
    }

    clearPendingTimer();
    timerRef.current = setTimeout(() => {
      setFeedbackResult(null);
      if (correct) {
        const next: ChordDefinition = pickRandomChord(chords, currentChord.id);
        setCurrentChord(next);
        setRevealedId(null);
        setPhase("waitingForPrompt");
        onCorrectComplete?.();
      } else {
        setPhase("readyToAnswer");
      }
    }, correct ? FEEDBACK_DELAY_CORRECT : FEEDBACK_DELAY_INCORRECT);
  }, [phase, currentChord, chords, onCorrectComplete, clearPendingTimer]);

  const markPromptPlayed = useCallback(() => {
    setPhase((currentPhase: QuizPhase) => (
      currentPhase === "waitingForPrompt" ? "readyToAnswer" : currentPhase
    ));
  }, []);

  return {
    currentChord,
    feedbackResult,
    revealedId,
    answerDisabled: phase !== "readyToAnswer",
    handleAnswer,
    markPromptPlayed,
  };
}
