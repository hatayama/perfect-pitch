import type { CSSProperties } from "react";
import type { ChordDefinition } from "../constants/chords";

interface ColorFlagProps {
  readonly chord: ChordDefinition;
  readonly revealed: boolean;
  readonly onClick: () => void;
  readonly disabled: boolean;
}

// 黒(#212121)はボーダーがないと背景と同化するため、専用のボーダーを付与
const DARK_BORDER = "3px solid #666";
const DEFAULT_BORDER = "3px solid transparent";

export function ColorFlag({ chord, revealed, onClick, disabled }: ColorFlagProps) {
  const disabledStyle: CSSProperties = disabled
    ? {
        backgroundColor: chord.colorHex,
        color: chord.textColor,
        border: chord.colorHex === "#212121" ? DARK_BORDER : DEFAULT_BORDER,
        cursor: "not-allowed",
        opacity: 0.72,
        filter: "brightness(0.82) saturate(0.9)",
        boxShadow: "none",
      }
    : {
        backgroundColor: chord.colorHex,
        color: chord.textColor,
        border: chord.colorHex === "#212121" ? DARK_BORDER : DEFAULT_BORDER,
        cursor: "pointer",
        opacity: 1,
        filter: "none",
        boxShadow: "0 6px 14px rgba(0, 0, 0, 0.12)",
      };

  return (
    <button
      className="color-flag"
      onClick={onClick}
      disabled={disabled}
      style={{
        ...disabledStyle,
      }}
      onPointerDown={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.93)";
        }
      }}
      onPointerUp={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
      }}
      onPointerLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
      }}
    >
      {revealed ? chord.label : ""}
    </button>
  );
}
