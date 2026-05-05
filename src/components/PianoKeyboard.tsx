// ピアノ鍵盤をSVGで描画し、指定された音をハイライトする

interface PianoKeyboardProps {
  readonly highlightNotes: readonly string[];
  readonly highlightColor: string;
}

interface KeyLayout {
  readonly note: string;
  readonly isBlack: boolean;
  readonly x: number;
}

const WHITE_KEY_WIDTH = 40;
const KEY_HEIGHT_SCALE = 0.5;
const WHITE_KEY_HEIGHT = 150 * KEY_HEIGHT_SCALE;
const BLACK_KEY_HEIGHT = 95 * KEY_HEIGHT_SCALE;
const BLACK_KEY_WIDTH = 26;

function buildKeyLayout(): KeyLayout[] {
  const whiteNotes: string[] = ["C", "D", "E", "F", "G", "A", "B"];
  const blackNotes: Map<string, number> = new Map([
    ["C#", 0], ["D#", 1], ["F#", 3], ["G#", 4], ["A#", 5],
  ]);

  const keys: KeyLayout[] = [];
  let whiteIndex = 0;

  for (let octave = 3; octave <= 5; octave++) {
    for (const noteName of whiteNotes) {
      keys.push({ note: `${noteName}${octave}`, isBlack: false, x: whiteIndex * WHITE_KEY_WIDTH });
      whiteIndex++;

      if (octave === 5 && noteName === "C") {
        break;
      }
    }
    if (octave === 5) break;
  }

  whiteIndex = 0;
  for (let octave = 3; octave <= 4; octave++) {
    for (const noteName of whiteNotes) {
      const blackOffset: number | undefined = blackNotes.get(`${noteName}#`);
      if (blackOffset !== undefined) {
        const xPos: number = whiteIndex * WHITE_KEY_WIDTH + WHITE_KEY_WIDTH * 0.65;
        keys.push({ note: `${noteName}#${octave}`, isBlack: true, x: xPos });

        // Bb/Eb エイリアス — Tone.jsのフラット表記との照合用
        if (noteName === "A") {
          keys.push({ note: `Bb${octave + 1}`, isBlack: true, x: xPos });
        }
        if (noteName === "D") {
          keys.push({ note: `Eb${octave}`, isBlack: true, x: xPos });
        }
      }
      whiteIndex++;
      if (octave === 4 && noteName === "B") break;
    }
  }

  return keys;
}

function normalizeNote(n: string): string {
  return n
    .replace("Db", "C#").replace("Eb", "D#").replace("Gb", "F#")
    .replace("Ab", "G#").replace("Bb", "A#");
}

const ALL_KEYS: KeyLayout[] = buildKeyLayout();
const WHITE_KEYS: KeyLayout[] = ALL_KEYS.filter((k: KeyLayout) => !k.isBlack);
const BLACK_KEYS: KeyLayout[] = ALL_KEYS.filter((k: KeyLayout) => k.isBlack);
const TOTAL_WIDTH: number = WHITE_KEYS.length * WHITE_KEY_WIDTH;

function isNoteHighlighted(keyNote: string, highlightNotes: readonly string[]): boolean {
  const normalized: string = normalizeNote(keyNote);
  return highlightNotes.some((hn: string) => normalized === normalizeNote(hn));
}

export function PianoKeyboard({ highlightNotes, highlightColor }: PianoKeyboardProps) {
  return (
    <svg
      viewBox={`0 0 ${TOTAL_WIDTH} ${WHITE_KEY_HEIGHT}`}
      style={{ width: "100%", maxWidth: "600px" }}
    >
      {WHITE_KEYS.map((key: KeyLayout) => {
        const highlighted: boolean = isNoteHighlighted(key.note, highlightNotes);
        return (
          <rect
            key={key.note}
            x={key.x}
            y={0}
            width={38}
            height={WHITE_KEY_HEIGHT}
            rx={0}
            ry={4}
            style={{
              fill: highlighted ? highlightColor : "var(--piano-white)",
              stroke: "var(--piano-white-stroke)",
              strokeWidth: 1.5,
            }}
          />
        );
      })}
      {BLACK_KEYS.map((key: KeyLayout) => {
        const highlighted: boolean = isNoteHighlighted(key.note, highlightNotes);
        return (
          <rect
            key={key.note}
            x={key.x}
            y={0}
            width={BLACK_KEY_WIDTH}
            height={BLACK_KEY_HEIGHT}
            rx={0}
            ry={3}
            style={{
              fill: highlighted ? highlightColor : "var(--piano-black)",
              stroke: "var(--piano-black-stroke)",
              strokeWidth: 1,
            }}
          />
        );
      })}
    </svg>
  );
}
