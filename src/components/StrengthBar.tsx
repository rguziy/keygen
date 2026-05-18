"use client";

import type { StrengthLevel } from "@/lib/crypto";

const COLORS: Record<StrengthLevel, string> = {
  weak: "#E24B4A",
  fair: "#EF9F27",
  strong: "#639922",
  excellent: "#1D9E75",
};

type Props = {
  score: number;
  level: StrengthLevel;
  label: string;
};

export default function StrengthBar({ score, level, label }: Props) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          flex: 1,
          height: 4,
          background: "var(--border-light)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${score}%`,
            background: COLORS[level],
            borderRadius: 2,
            transition: "width 0.3s, background 0.3s",
          }}
        />
      </div>
      <span
        style={{
          fontSize: 12,
          color: COLORS[level],
          minWidth: 60,
          textAlign: "right",
          fontWeight: 500,
        }}
      >
        {label}
      </span>
    </div>
  );
}
