import type { ChordDefinition } from "../constants/chords";
import { assert } from "./assert";

export function pickRandomChord(
  chords: readonly ChordDefinition[],
  lastChordId: string | null,
): ChordDefinition {
  assert(chords.length > 0, "chords must not be empty");

  if (chords.length === 1) {
    return chords[0];
  }

  const candidates: readonly ChordDefinition[] = lastChordId === null
    ? chords
    : chords.filter((chord: ChordDefinition) => chord.id !== lastChordId);

  assert(candidates.length > 0, "candidates must not be empty");

  const selectedIndex: number = Math.floor(Math.random() * candidates.length);
  const selectedChord: ChordDefinition | undefined = candidates[selectedIndex];
  assert(selectedChord !== undefined, "selected chord must exist");

  return selectedChord;
}
