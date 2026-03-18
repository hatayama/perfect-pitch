interface FeedbackProps {
  readonly correct: boolean | null;
}

export function Feedback({ correct }: FeedbackProps) {
  if (correct === null) {
    return null;
  }

  return (
    <div
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
        pointerEvents: "none",
        animation: "fadeIn 0.2s ease",
      }}
    >
      {correct ? (
        <div style={{
          fontSize: "8rem",
          color: "#4CAF50",
          textShadow: "0 4px 20px rgba(76,175,80,0.5)",
          animation: "popIn 0.3s ease",
        }}>
          &#x2B50;
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
