import { ALL_CHORDS, type ChordDefinition } from "../constants/chords";
import { BackButton } from "./BackButton";

interface SettingsScreenProps {
  readonly enabledChordIds: ReadonlySet<string>;
  readonly onToggleChord: (chordId: string) => void;
  readonly onResetToDefault: () => void;
  readonly onBack: () => void;
}

export function SettingsScreen({
  enabledChordIds,
  onToggleChord,
  onResetToDefault,
  onBack,
}: SettingsScreenProps) {
  const enabledCount: number = enabledChordIds.size;

  return (
    <div style={{
      textAlign: "center",
      padding: "32px 16px",
      maxWidth: "500px",
      margin: "0 auto",
    }}>
      <BackButton onClick={onBack} />

      <h2 style={{ marginTop: "48px", fontSize: "1.4rem", color: "#e0e0e0", marginBottom: "24px" }}>
        おとの せってい
      </h2>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        maxWidth: "360px",
        margin: "0 auto",
      }}>
        {ALL_CHORDS.map((chord: ChordDefinition) => {
          const enabled: boolean = enabledChordIds.has(chord.id);
          // 最後の1つは無効化させない
          const isLastEnabled: boolean = enabled && enabledCount <= 1;

          return (
            <div
              key={chord.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 16px",
                borderRadius: "12px",
                backgroundColor: enabled ? "#1e1e1e" : "#161616",
                border: enabled ? "1px solid #444" : "1px solid #333",
              }}
            >
              <div style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                backgroundColor: chord.colorHex,
                border: "2px solid #666",
                flexShrink: 0,
                opacity: enabled ? 1 : 0.3,
              }} />

              <span style={{
                flex: 1,
                textAlign: "left",
                marginLeft: "12px",
                fontSize: "1rem",
                color: enabled ? "#e0e0e0" : "#666",
              }}>
                {chord.label}
                <span style={{ fontSize: "0.8rem", color: "#888", marginLeft: "8px" }}>
                  {chord.colorName}
                </span>
              </span>

              <button
                onClick={() => onToggleChord(chord.id)}
                disabled={isLastEnabled}
                style={{
                  padding: "6px 16px",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "0.85rem",
                  cursor: isLastEnabled ? "not-allowed" : "pointer",
                  backgroundColor: enabled ? "#4CAF50" : "#444",
                  color: enabled ? "#fff" : "#888",
                  opacity: isLastEnabled ? 0.5 : 1,
                }}
              >
                {enabled ? "ON" : "OFF"}
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={onResetToDefault}
        style={{
          marginTop: "24px",
          fontSize: "0.9rem",
          padding: "10px 24px",
          borderRadius: "10px",
          border: "1px solid #555",
          backgroundColor: "#1e1e1e",
          color: "#aaa",
          cursor: "pointer",
        }}
      >
        すべて ON にする
      </button>
    </div>
  );
}
