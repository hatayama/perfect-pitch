import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChordDefinition } from "../constants/chords";
import { playChord, initSampler } from "../audio/ChordPlayer";
import { assert } from "../utils/assert";
import { PianoKeyboard } from "./PianoKeyboard";
import { BackButton } from "./BackButton";

interface PianoPlayModeProps {
  readonly enabledChords: readonly ChordDefinition[];
  readonly onBack: () => void;
}

export function PianoPlayMode({ enabledChords, onBack }: PianoPlayModeProps) {
  assert(enabledChords.length > 0, "enabledChords must not be empty");

  const [selectedChord, setSelectedChord] = useState<ChordDefinition>(enabledChords[0]);

  // enabledChordsが変更された場合、selectedChordが無効になる可能性があるためフォールバック
  const activeChord: ChordDefinition = useMemo(() => {
    const stillValid: boolean = enabledChords.some((c: ChordDefinition) => c.id === selectedChord.id);
    return stillValid ? selectedChord : enabledChords[0];
  }, [enabledChords, selectedChord]);

  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    initSampler().then(() => setReady(true));
  }, []);

  const handlePlay = useCallback(() => {
    playChord(activeChord.notes);
  }, [activeChord]);

  // 黒(#212121)だと鍵盤のハイライトが見えにくいため、少し明るいグレーを使う
  const highlightColor: string = activeChord.colorHex === "#212121"
    ? "#666"
    : activeChord.colorHex;

  return (
    <div style={{ textAlign: "center", padding: "16px" }}>
      <BackButton onClick={onBack} />

      <h2 style={{ marginTop: "48px", fontSize: "1.4rem", color: "#e0e0e0" }}>
        ひく おとを えらんでね
      </h2>

      {/* 色ボタン一覧 */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
        gap: "8px",
        maxWidth: "500px",
        margin: "16px auto 24px",
        padding: "0 8px",
      }}>
        {enabledChords.map((chord: ChordDefinition) => {
          const isSelected: boolean = chord.id === activeChord.id;
          return (
            <button
              key={chord.id}
              onClick={() => setSelectedChord(chord)}
              style={{
                backgroundColor: chord.colorHex,
                color: chord.textColor,
                border: isSelected ? "3px solid #e0e0e0" : "3px solid transparent",
                borderRadius: "12px",
                padding: "12px 8px",
                fontSize: "0.85rem",
                fontWeight: "bold",
                cursor: "pointer",
                opacity: isSelected ? 1 : 0.7,
                transform: isSelected ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.15s ease, opacity 0.15s ease",
              }}
            >
              {chord.colorName}
            </button>
          );
        })}
      </div>

      {/* 選択中の和音情報 */}
      <div style={{
        margin: "0 auto 16px",
        padding: "12px 24px",
        backgroundColor: activeChord.colorHex,
        color: activeChord.textColor,
        borderRadius: "12px",
        display: "inline-block",
        fontSize: "1.3rem",
        fontWeight: "bold",
      }}>
        {activeChord.colorName} — {activeChord.label}
      </div>

      {/* 再生ボタン */}
      <button
        onClick={handlePlay}
        disabled={!ready}
        style={{
          fontSize: "2rem",
          padding: "16px",
          borderRadius: "50%",
          border: "none",
          backgroundColor: ready ? "#546E7A" : "#444",
          color: "#fff",
          cursor: ready ? "pointer" : "default",
          width: "80px",
          height: "80px",
          margin: "0 auto 16px",
          boxShadow: "0 4px 12px rgba(84,110,122,0.4)",
          display: "block",
        }}
      >
        {ready ? "♪" : "..."}
      </button>

      {/* ピアノ鍵盤 */}
      <div style={{ margin: "0 auto", padding: "0 8px" }}>
        <PianoKeyboard
          highlightNotes={activeChord.notes}
          highlightColor={highlightColor}
        />
      </div>
    </div>
  );
}
