import * as Tone from "tone";

const CHORD_REPEAT_COUNT = 3;
const CHORD_DURATION = "2n";
const CHORD_INTERVAL_SEC = 1.2;

// iOSの消音モードでもWeb Audio APIの音を鳴らすため、HTML5 Audio要素で無音を再生して音声セッションを"playback"に切り替える
const SILENT_MP3 = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYoRBqJAAAAAAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYoRBqJAAAAAAAAAAAAAAAAAAAA";
let silentAudioUnlocked = false;

function unlockIOSAudio(): void {
  if (silentAudioUnlocked) return;
  silentAudioUnlocked = true;

  const audio: HTMLAudioElement = new Audio(SILENT_MP3);
  audio.play().catch(() => {
    // 再生失敗は無視（非iOS環境では不要なため）
  });
}

let sampler: Tone.Sampler | null = null;
let samplerReadyPromise: Promise<void> | null = null;
let scheduledEventIds: number[] = [];

function createSampler(): Promise<void> {
  if (samplerReadyPromise !== null) {
    return samplerReadyPromise;
  }

  samplerReadyPromise = new Promise<void>((resolve) => {
    // Salamander Grand Piano samples (hosted on tonejs.github.io)
    sampler = new Tone.Sampler({
      urls: {
        A0: "A0.mp3",
        C1: "C1.mp3",
        "D#1": "Ds1.mp3",
        "F#1": "Fs1.mp3",
        A1: "A1.mp3",
        C2: "C2.mp3",
        "D#2": "Ds2.mp3",
        "F#2": "Fs2.mp3",
        A2: "A2.mp3",
        C3: "C3.mp3",
        "D#3": "Ds3.mp3",
        "F#3": "Fs3.mp3",
        A3: "A3.mp3",
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
        C5: "C5.mp3",
        "D#5": "Ds5.mp3",
        "F#5": "Fs5.mp3",
        A5: "A5.mp3",
        C6: "C6.mp3",
        "D#6": "Ds6.mp3",
        "F#6": "Fs6.mp3",
        A6: "A6.mp3",
        C7: "C7.mp3",
        "D#7": "Ds7.mp3",
        "F#7": "Fs7.mp3",
        A7: "A7.mp3",
        C8: "C8.mp3",
      },
      release: 1,
      volume: 10,
      baseUrl: "https://tonejs.github.io/audio/salamander/",
      onload: resolve,
    }).toDestination();
  });

  return samplerReadyPromise;
}

export function initSampler(): Promise<void> {
  return createSampler();
}

// 0〜100のパーセント値をTone.jsのデシベル値に変換して適用
export function setVolume(percent: number): void {
  const db: number = percent <= 0 ? -Infinity : -40 * (1 - percent / 100);
  Tone.getDestination().volume.value = db;
}

function stopCurrentPlayback(): void {
  for (const id of scheduledEventIds) {
    Tone.getTransport().clear(id);
  }
  scheduledEventIds = [];
  sampler?.releaseAll();
}

export async function playChord(notes: readonly string[]): Promise<void> {
  unlockIOSAudio();
  await Tone.start();
  await createSampler();

  stopCurrentPlayback();

  const s: Tone.Sampler = sampler!;
  const transport = Tone.getTransport();
  const now: number = Tone.now();
  for (let i = 0; i < CHORD_REPEAT_COUNT; i++) {
    const time: number = now + i * CHORD_INTERVAL_SEC;
    const eventId: number = transport.scheduleOnce(() => {
      s.triggerAttackRelease(notes as string[], CHORD_DURATION);
    }, time);
    scheduledEventIds.push(eventId);
  }
  transport.start();
}

export async function playSingleNote(note: string): Promise<void> {
  unlockIOSAudio();
  await Tone.start();
  await createSampler();

  sampler!.triggerAttackRelease(note, CHORD_DURATION);
}
