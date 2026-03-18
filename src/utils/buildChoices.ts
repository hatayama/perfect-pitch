import { ALL_CHORDS, MIN_CHOICES, type ChordDefinition } from "../constants/chords";
import { assert } from "./assert";

// アンロック済みが少ない場合、未アンロックの和音をダミー選択肢として追加して最低数を確保する
export function buildChoices(unlockedChords: readonly ChordDefinition[]): readonly ChordDefinition[] {
  assert(unlockedChords.length > 0, "unlockedChords must not be empty");

  if (unlockedChords.length >= MIN_CHOICES) {
    return unlockedChords;
  }

  const unlockedIds: Set<string> = new Set(unlockedChords.map((c: ChordDefinition) => c.id));
  const extras: ChordDefinition[] = ALL_CHORDS.filter(
    (c: ChordDefinition) => !unlockedIds.has(c.id),
  );

  const needed: number = MIN_CHOICES - unlockedChords.length;
  const fillers: ChordDefinition[] = extras.slice(0, needed);

  return [...unlockedChords, ...fillers];
}
