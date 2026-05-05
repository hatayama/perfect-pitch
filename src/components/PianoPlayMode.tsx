import { memo, useEffect, useState } from "react";
import { ALL_CHORDS, type ChordDefinition } from "../constants/chords";
import { playChord, initSampler, prepareAudioPlayback } from "../audio/ChordPlayer";
import { useVolume } from "../hooks/useVolume";
import { ChordPianoKeyboard } from "./ChordPianoKeyboard";
import { BackButton } from "./BackButton";
import { VolumeSlider } from "./VolumeSlider";

interface PianoPlayModeProps {
  readonly onBack: () => void;
}

function handlePointerDown(): void {
  void prepareAudioPlayback();
}

interface ChordCardProps {
  readonly chord: ChordDefinition;
  readonly ready: boolean;
}

const ChordCard = memo(function ChordCard({ chord, ready }: ChordCardProps) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "600px",
        padding: "12px",
        borderRadius: "12px",
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "8px",
      }}>
        <div style={{
          padding: "6px 16px",
          backgroundColor: chord.colorHex,
          color: chord.textColor,
          borderRadius: "8px",
          fontSize: "0.95rem",
          fontWeight: "bold",
        }}>
          {chord.colorName} — {chord.label}
        </div>
        <button
          onClick={() => playChord(chord.notes)}
          onPointerDown={handlePointerDown}
          disabled={!ready}
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: ready ? "var(--btn-play)" : "var(--bg-disabled)",
            color: "#fff",
            fontSize: "1.2rem",
            cursor: ready ? "pointer" : "default",
            boxShadow: "0 2px 8px var(--btn-play-shadow)",
            flexShrink: 0,
          }}
        >
          {ready ? "♪" : "..."}
        </button>
      </div>
      <ChordPianoKeyboard chord={chord} />
    </div>
  );
});

export function PianoPlayMode({ onBack }: PianoPlayModeProps) {
  const { volume, updateVolume } = useVolume();
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    initSampler().then(() => setReady(true));
  }, []);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "16px",
      gap: "16px",
    }}>
      <BackButton onClick={onBack} />

      <div style={{ marginTop: "48px", width: "100%", maxWidth: "500px" }}>
        <VolumeSlider volume={volume} onChangeVolume={updateVolume} />
      </div>

      {ALL_CHORDS.map((chord: ChordDefinition) => (
        <ChordCard key={chord.id} chord={chord} ready={ready} />
      ))}
    </div>
  );
}
