import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { ChordDefinition } from "../constants/chords";
import { ALL_CHORDS } from "../constants/chords";

function QrSection() {
  const [showQr, setShowQr] = useState<boolean>(false);
  const url: string = window.location.href;

  return (
    <div style={{ marginTop: "24px" }}>
      <button
        onClick={() => setShowQr((prev: boolean) => !prev)}
        style={{
          fontSize: "0.85rem",
          color: "#666",
          background: "none",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "8px 16px",
          cursor: "pointer",
        }}
      >
        {showQr ? "QRコードをとじる" : "QRコードをひらく"}
      </button>
      {showQr && (
        <div style={{ marginTop: "12px" }}>
          <QRCodeSVG value={url} size={160} />
          <p style={{ fontSize: "0.75rem", color: "#999", marginTop: "8px" }}>
            {url}
          </p>
        </div>
      )}
    </div>
  );
}

interface HomeScreenProps {
  readonly currentLevel: number;
  readonly unlockedChords: readonly ChordDefinition[];
  readonly levelUpDays: number;
  readonly onStartAppMode: () => void;
  readonly onStartPianoMode: () => void;
  readonly onChangeLevelUpDays: (days: number) => void;
  readonly onReset: () => void;
}

export function HomeScreen({
  currentLevel,
  unlockedChords,
  levelUpDays,
  onStartAppMode,
  onStartPianoMode,
  onChangeLevelUpDays,
  onReset,
}: HomeScreenProps) {
  return (
    <div style={{
      textAlign: "center",
      padding: "32px 16px",
      maxWidth: "500px",
      margin: "0 auto",
    }}>
      <h1 style={{
        fontSize: "2rem",
        color: "#333",
        marginBottom: "8px",
      }}>
        ぜったいおんかん
      </h1>
      <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "32px" }}>
        れんしゅう
      </p>

      {/* 進捗表示 */}
      <div style={{
        display: "flex",
        gap: "6px",
        justifyContent: "center",
        flexWrap: "wrap",
        marginBottom: "32px",
      }}>
        {ALL_CHORDS.map((chord: ChordDefinition, i: number) => (
          <div
            key={chord.id}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              backgroundColor: i < currentLevel ? chord.colorHex : "#e0e0e0",
              border: chord.textColor === "#fff" && i < currentLevel
                ? "2px solid #666"
                : "2px solid transparent",
              transition: "background-color 0.3s ease",
            }}
            title={i < currentLevel ? `${chord.colorName} (${chord.label})` : "???"}
          />
        ))}
      </div>

      <p style={{ color: "#666", fontSize: "1rem", marginBottom: "40px" }}>
        いま {unlockedChords.length}こ の おとが つかえるよ
      </p>

      {/* モード選択 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
        <button
          onClick={onStartAppMode}
          style={{
            fontSize: "1.4rem",
            padding: "20px 48px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#2196F3",
            color: "#fff",
            cursor: "pointer",
            width: "100%",
            maxWidth: "300px",
            boxShadow: "0 4px 12px rgba(33,150,243,0.3)",
          }}
        >
          アプリで れんしゅう
        </button>

        <button
          onClick={onStartPianoMode}
          style={{
            fontSize: "1.4rem",
            padding: "20px 48px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#4CAF50",
            color: "#fff",
            cursor: "pointer",
            width: "100%",
            maxWidth: "300px",
            boxShadow: "0 4px 12px rgba(76,175,80,0.3)",
          }}
        >
          ピアノで れんしゅう
        </button>
      </div>

      {/* レベルアップ日数設定（親向け） */}
      <div style={{
        marginTop: "48px",
        padding: "16px",
        backgroundColor: "#f5f5f5",
        borderRadius: "12px",
        maxWidth: "300px",
        margin: "48px auto 0",
      }}>
        <label style={{ fontSize: "0.85rem", color: "#666" }}>
          レベルアップまでの日数: <strong>{levelUpDays}日</strong>
        </label>
        <input
          type="range"
          min={1}
          max={30}
          value={levelUpDays}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChangeLevelUpDays(Number(e.target.value))
          }
          style={{ width: "100%", marginTop: "8px" }}
        />
      </div>

      {/* QRコード（他デバイスからのアクセス用） */}
      <QrSection />

      {/* リセットボタン（親向け） */}
      <button
        onClick={() => {
          if (window.confirm("進捗をリセットしますか？")) {
            onReset();
          }
        }}
        style={{
          marginTop: "64px",
          fontSize: "0.8rem",
          color: "#aaa",
          background: "none",
          border: "none",
          cursor: "pointer",
          textDecoration: "underline",
        }}
      >
        進捗リセット
      </button>
    </div>
  );
}
