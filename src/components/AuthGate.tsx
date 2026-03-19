import { useCallback, useState } from "react";
import { BackButton } from "./BackButton";

interface AuthGateProps {
  readonly onSuccess: () => void;
  readonly onCancel: () => void;
}

function generateProblem(): { a: number; b: number } {
  const a: number = Math.floor(Math.random() * 9) + 1;
  const b: number = Math.floor(Math.random() * 9) + 1;
  return { a, b };
}

export function AuthGate({ onSuccess, onCancel }: AuthGateProps) {
  const [problem, setProblem] = useState(generateProblem);
  const [input, setInput] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);

  const handleSubmit = useCallback(() => {
    const answer: number = problem.a * problem.b;
    if (Number(input) === answer) {
      onSuccess();
    } else {
      setShowError(true);
      setInput("");
      setProblem(generateProblem());
    }
  }, [input, problem, onSuccess]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }, [handleSubmit]);

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

      <input
        type="number"
        inputMode="numeric"
        value={input}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setShowError(false);
          setInput(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        style={{
          fontSize: "1.5rem",
          padding: "12px",
          width: "120px",
          textAlign: "center",
          borderRadius: "12px",
          border: "2px solid var(--border-default)",
          backgroundColor: "var(--bg-input)",
          color: "var(--text-primary)",
          outline: "none",
        }}
        autoFocus
      />

      <div style={{ marginTop: "16px" }}>
        <button
          onClick={handleSubmit}
          disabled={input === ""}
          style={{
            fontSize: "1.2rem",
            padding: "12px 32px",
            borderRadius: "12px",
            border: "none",
            backgroundColor: input === "" ? "var(--bg-disabled)" : "#2196F3",
            color: "#fff",
            cursor: input === "" ? "default" : "pointer",
          }}
        >
          たしかめる
        </button>
      </div>

      {showError && (
        <p style={{ color: "var(--error)", fontSize: "1.1rem", marginTop: "16px" }}>
          ちがうよ、もういちど！
        </p>
      )}
    </div>
  );
}
