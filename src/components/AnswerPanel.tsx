import type { ChordDefinition } from "../constants/chords";
import { ColorFlag } from "./ColorFlag";

interface AnswerPanelProps {
  readonly chords: readonly ChordDefinition[];
  readonly revealedId: string | null;
  readonly disabled: boolean;
  readonly onAnswer: (chord: ChordDefinition) => void;
}

export function AnswerPanel({ chords, revealedId, disabled, onAnswer }: AnswerPanelProps) {
  return (
    <div className="answer-panel">
      {chords.map((chord: ChordDefinition) => (
        <ColorFlag
          key={chord.id}
          chord={chord}
          revealed={revealedId === chord.id}
          disabled={disabled}
          onClick={() => onAnswer(chord)}
        />
      ))}
    </div>
  );
}
