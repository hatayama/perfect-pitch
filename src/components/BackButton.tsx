interface BackButtonProps {
  readonly onClick: () => void;
}

const STYLE: React.CSSProperties = {
  position: "absolute",
  top: "16px",
  left: "16px",
  fontSize: "1.2rem",
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "#666",
};

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button onClick={onClick} style={STYLE}>
      ← もどる
    </button>
  );
}
