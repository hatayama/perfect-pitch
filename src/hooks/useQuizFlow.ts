import { useCallback, useEffect, useRef, useState } from "react";
import type { ChordDefinition } from "../constants/chords";
import { playCorrectSe, playIncorrectSe } from "../audio/ChordPlayer";
import { pickRandomChord } from "../utils/pickRandomChord";

const FEEDBACK_DELAY_INCORRECT = 2000;
const CORRECT_FEEDBACK_DISMISS_DELAY = 1000;
type QuizPhase = "waitingForPrompt" | "readyToAnswer" | "showingCorrect" | "showingIncorrect";

interface QuizFlowResult {
  currentChord: ChordDefinition;
  feedbackResult: boolean | null;
  feedbackDismissible: boolean;
  revealedId: string | null;
  answerDisabled: boolean;
  handleAnswer: (selected: ChordDefinition) => void;
  markPromptPlayed: () => void;
  dismissCorrectFeedback: () => void;
  dismissIncorrectFeedback: () => void;
}

export function useQuizFlow(
  chords: readonly ChordDefinition[],
  onCorrectComplete?: () => void,
): QuizFlowResult {
  const [currentChord, setCurrentChord] = useState<ChordDefinition>(() =>
    pickRandomChord(chords, null)
  );
  const [feedbackResult, setFeedbackResult] = useState<boolean | null>(null);
  const [feedbackDismissible, setFeedbackDismissible] = useState<boolean>(false);
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

  const completeCorrectAnswer = useCallback(() => {
    const next: ChordDefinition = pickRandomChord(chords, currentChord.id);
    setCurrentChord(next);
    setFeedbackResult(null);
    setFeedbackDismissible(false);
    setRevealedId(null);
    setPhase("waitingForPrompt");
    onCorrectComplete?.();
  }, [chords, currentChord, onCorrectComplete]);

  const dismissCorrectFeedback = useCallback(() => {
    if (phase !== "showingCorrect") return;
    if (!feedbackDismissible) return;

    completeCorrectAnswer();
  }, [phase, feedbackDismissible, completeCorrectAnswer]);

  const dismissIncorrectFeedback = useCallback(() => {
    if (phase !== "showingIncorrect") return;

    clearPendingTimer();
    setFeedbackResult(null);
    setFeedbackDismissible(false);
    setPhase("readyToAnswer");
  }, [phase, clearPendingTimer]);

  const handleAnswer = useCallback((selected: ChordDefinition) => {
    if (phase !== "readyToAnswer") return;

    const correct: boolean = selected.id === currentChord.id;
    setFeedbackResult(correct);
    setFeedbackDismissible(!correct);

    if (correct) {
      setRevealedId(selected.id);
      setPhase("showingCorrect");
      void playCorrectSe();
      clearPendingTimer();
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        setFeedbackDismissible(true);
      }, CORRECT_FEEDBACK_DISMISS_DELAY);
      return;
    }

    setPhase("showingIncorrect");
    void playIncorrectSe();

    clearPendingTimer();
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setFeedbackResult(null);
      setFeedbackDismissible(false);
      setPhase("readyToAnswer");
    }, FEEDBACK_DELAY_INCORRECT);
  }, [phase, currentChord, clearPendingTimer]);

  const markPromptPlayed = useCallback(() => {
    setPhase((currentPhase: QuizPhase) => (
      currentPhase === "waitingForPrompt" ? "readyToAnswer" : currentPhase
    ));
  }, []);

  return {
    currentChord,
    feedbackResult,
    feedbackDismissible,
    revealedId,
    answerDisabled: phase !== "readyToAnswer",
    handleAnswer,
    markPromptPlayed,
    dismissCorrectFeedback,
    dismissIncorrectFeedback,
  };
}
