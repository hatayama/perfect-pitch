import { useCallback, useState } from "react";
import { BackButton } from "./BackButton";

const MIN_FACTOR = 3;
const MAX_FACTOR = 10;
const CHOICE_COUNT = 6;

interface AuthGateProps {
  readonly onSuccess: () => void;
  readonly onCancel: () => void;
}

function generateProblem(): { a: number; b: number } {
  const a: number = Math.floor(Math.random() * (MAX_FACTOR - MIN_FACTOR + 1)) + MIN_FACTOR;
  const b: number = Math.floor(Math.random() * (MAX_FACTOR - MIN_FACTOR + 1)) + MIN_FACTOR;
  return { a, b };
}

function shuffleNumbers(values: number[]): number[] {
  const shuffled: number[] = [...values];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1));
    const current: number = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = current;
  }
  return shuffled;
}

function generateChoices(answer: number): readonly number[] {
  const candidates: Set<number> = new Set([answer]);

  while (candidates.size < CHOICE_COUNT) {
    const offset: number = Math.floor(Math.random() * 17) - 8;
    const candidate: number = answer + offset;
    if (candidate <= 0 || candidate === answer) {
      continue;
    }
    candidates.add(candidate);
  }

  return shuffleNumbers([...candidates]);
}

function generateQuestion(): { problem: { a: number; b: number }; choices: readonly number[] } {
  const problem: { a: number; b: number } = generateProblem();
  return {
    problem,
    choices: generateChoices(problem.a * problem.b),
  };
}

export function AuthGate({ onSuccess, onCancel }: AuthGateProps) {
  const [initialQuestion] = useState(generateQuestion);
  const [problem, setProblem] = useState<{ a: number; b: number }>(initialQuestion.problem);
  const [choices, setChoices] = useState<readonly number[]>(initialQuestion.choices);
  const [showError, setShowError] = useState<boolean>(false);

  const resetProblem = useCallback(() => {
    const nextQuestion: { problem: { a: number; b: number }; choices: readonly number[] } = generateQuestion();
    setProblem(nextQuestion.problem);
    setChoices(nextQuestion.choices);
  }, []);

  const handleSelect = useCallback((selectedAnswer: number) => {
    const answer: number = problem.a * problem.b;
    if (selectedAnswer === answer) {
      onSuccess();
      return;
    }

    setShowError(true);
    resetProblem();
  }, [onSuccess, problem, resetProblem]);

  return (
    <div style={{
      textAlign: "center",
      padding: "32px 16px",
      maxWidth: "400px",
      margin: "0 auto",
    }}>
      <BackButton onClick={onCancel} />

      <h2 style={{ marginTop: "48px", fontSize: "1.4rem", color: "var(--text-primary)" }}>
        おとなの かくにん
      </h2>

      <p style={{ fontSize: "2rem", margin: "32px 0 16px", color: "var(--text-primary)" }}>
        {problem.a} × {problem.b} = ?
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "12px",
          marginTop: "24px",
        }}
      >
        {choices.map((choice: number) => (
          <button
            key={choice}
            onClick={() => {
              setShowError(false);
              handleSelect(choice);
            }}
            style={{
              fontSize: "1.3rem",
              fontWeight: 700,
              padding: "14px 0",
              borderRadius: "14px",
              border: "none",
              backgroundColor: "var(--btn-play)",
              color: "#fff",
              cursor: "pointer",
              boxShadow: "0 4px 12px var(--btn-play-shadow)",
            }}
          >
            {choice}
          </button>
        ))}
      </div>

      {showError && (
        <p style={{ color: "var(--error)", fontSize: "1.1rem", marginTop: "16px" }}>
          ちがうよ、もういちど！
        </p>
      )}
    </div>
  );
}
