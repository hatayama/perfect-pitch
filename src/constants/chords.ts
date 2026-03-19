export interface ChordDefinition {
  readonly id: string;
  readonly label: string;
  readonly notes: readonly string[];
  readonly colorName: string;
  readonly colorHex: string;
  readonly textColor: string;
}

// 白鍵の和音（導入順序 = 楽譜1の順序）
const WHITE_KEY_CHORDS: readonly ChordDefinition[] = [
  { id: "do-mi-so", label: "ドミソ", notes: ["C4", "E4", "G4"], colorName: "赤", colorHex: "#E53935", textColor: "#fff" },
  { id: "do-fa-ra", label: "ドファラ", notes: ["C4", "F4", "A4"], colorName: "黄色", colorHex: "#FDD835", textColor: "#222" },
  { id: "si-re-so", label: "シレソ", notes: ["B3", "D4", "G4"], colorName: "青", colorHex: "#1E88E5", textColor: "#fff" },
  { id: "ra-do-fa", label: "ラドファ", notes: ["A3", "C4", "F4"], colorName: "黒", colorHex: "#212121", textColor: "#fff" },
  { id: "re-so-si", label: "レソシ", notes: ["D4", "G4", "B4"], colorName: "緑", colorHex: "#43A047", textColor: "#fff" },
  { id: "mi-so-do", label: "ミソド", notes: ["E4", "G4", "C5"], colorName: "オレンジ", colorHex: "#FB8C00", textColor: "#222" },
  { id: "fa-ra-do", label: "ファラド", notes: ["F4", "A4", "C5"], colorName: "紫", colorHex: "#8E24AA", textColor: "#fff" },
  { id: "so-si-re", label: "ソシレ", notes: ["G4", "B4", "D5"], colorName: "ピンク", colorHex: "#EC407A", textColor: "#fff" },
  { id: "so-do-mi", label: "ソドミ", notes: ["G3", "C4", "E4"], colorName: "茶色", colorHex: "#795548", textColor: "#fff" },
] as const;

// 黒鍵の和音
const BLACK_KEY_CHORDS: readonly ChordDefinition[] = [
  { id: "ra-dis-mi", label: "ラド#ミ", notes: ["A3", "C#4", "E4"], colorName: "黄緑", colorHex: "#7CB342", textColor: "#222" },
  { id: "re-fis-ra", label: "レファ#ラ", notes: ["D4", "F#4", "A4"], colorName: "肌色", colorHex: "#FFCC80", textColor: "#222" },
  { id: "mi-gis-si", label: "ミソ#シ", notes: ["E4", "G#4", "B4"], colorName: "藤色", colorHex: "#B39DDB", textColor: "#222" },
  { id: "sib-re-fa", label: "シ♭レファ", notes: ["Bb3", "D4", "F4"], colorName: "灰色", colorHex: "#9E9E9E", textColor: "#222" },
  { id: "mib-so-sib", label: "ミ♭ソシ♭", notes: ["Eb4", "G4", "Bb4"], colorName: "水色", colorHex: "#4FC3F7", textColor: "#222" },
] as const;

export const ALL_CHORDS: readonly ChordDefinition[] = [...WHITE_KEY_CHORDS, ...BLACK_KEY_CHORDS];

export const MIN_CHOICES = 3;
