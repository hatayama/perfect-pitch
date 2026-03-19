interface VolumeSliderProps {
  readonly volume: number;
  readonly onChangeVolume: (percent: number) => void;
}

export function VolumeSlider({ volume, onChangeVolume }: VolumeSliderProps) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      margin: "0 auto 16px",
      maxWidth: "200px",
    }}>
      <span style={{ fontSize: "1rem" }}>
        {volume === 0 ? "\uD83D\uDD07" : "\uD83D\uDD0A"}
      </span>
      <input
        type="range"
        min={0}
        max={100}
        value={volume}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChangeVolume(Number(e.target.value))
        }
        style={{ flex: 1 }}
      />
    </div>
  );
}
