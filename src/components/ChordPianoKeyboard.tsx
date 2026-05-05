import type { ChordDefinition } from "../constants/chords";
import { PianoKeyboard } from "./PianoKeyboard";

interface ChordPianoKeyboardProps {
  readonly chord: ChordDefinition;
}

const DARK_CHORD_COLOR = "#212121";
const DARK_CHORD_HIGHLIGHT_COLOR = "#666";

function getHighlightColor(colorHex: string): string {
  return colorHex === DARK_CHORD_COLOR ? DARK_CHORD_HIGHLIGHT_COLOR : colorHex;
}

export function ChordPianoKeyboard({ chord }: ChordPianoKeyboardProps) {
  return (
    <PianoKeyboard
      highlightNotes={chord.notes}
      highlightColor={getHighlightColor(chord.colorHex)}
    />
  );
}
