import type { ChordDefinition } from "../constants/chords";

// 覚えた和音ほど多く出題する重み付きランダム選択
// インデックスが小さい（古い）ほど重みが大きい
export function pickRandomChord(
  chords: readonly ChordDefinition[],
  lastChordId: string | null,
): ChordDefinition {
  const weights: number[] = chords.map((_: ChordDefinition, i: number) => chords.length - i);
  const totalWeight: number = weights.reduce((sum: number, w: number) => sum + w, 0);

  let attempts = 0;
  while (attempts < 20) {
    let random: number = Math.random() * totalWeight;
    for (let i = 0; i < chords.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        if (chords.length > 1 && chords[i].id === lastChordId) {
          break;
        }
        return chords[i];
      }
    }
    attempts++;
  }

  return chords[0];
}
