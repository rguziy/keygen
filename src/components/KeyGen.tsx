"use client";

import { useState, useCallback } from "react";
import {
  generatePassword,
  generateApiKey,
  generateUUID,
  calcStrength,
  type ApiFormat,
  type PasswordOptions,
} from "@/lib/crypto";
import StrengthBar from "./StrengthBar";
import CopyButton from "./CopyButton";

type Mode = "password" | "api" | "uuid";

const TAB_LABELS: { id: Mode; emoji: string; label: string }[] = [
  { id: "password", emoji: "🔑", label: "Password" },
  { id: "api", emoji: "⚡", label: "API Key" },
  { id: "uuid", emoji: "🆔", label: "UUID" },
];

const API_FORMATS: { id: ApiFormat; label: string }[] = [
  { id: "hex", label: "hex" },
  { id: "base64url", label: "base64url" },
  { id: "prefixed", label: "sk-..." },
  { id: "segments", label: "xxxx-xxxx-..." },
];

export default function KeyGen() {
  const [mode, setMode] = useState<Mode>("password");
  const [result, setResult] = useState("");
  const [batch, setBatch] = useState<string[]>([]);

  // Password options
  const [passOpts, setPassOpts] = useState<PasswordOptions>({
    length: 16,
    upper: true,
    lower: true,
    digits: true,
    symbols: false,
  });

  // API options
  const [apiFormat, setApiFormat] = useState<ApiFormat>("hex");
  const [apiBytes, setApiBytes] = useState(32);

  const generate = useCallback(
    (m = mode, opts = passOpts, fmt = apiFormat, bytes = apiBytes): string => {
      if (m === "password") return generatePassword(opts);
      if (m === "api") return generateApiKey(bytes, fmt);
      return generateUUID();
    },
    [mode, passOpts, apiFormat, apiBytes]
  );

  const handleGenerate = () => {
    const val = generate();
    setResult(val);
    setBatch([]);
  };

  const handleBatch = () => {
    const vals = Array.from({ length: 5 }, () => generate());
    setBatch(vals);
    setResult(vals[0]);
  };

  const handleModeChange = (m: Mode) => {
    setMode(m);
    setBatch([]);
    const val = generate(m);
    setResult(val);
  };

  const handlePassOpt = (key: keyof PasswordOptions, val: boolean | number) => {
    const next = { ...passOpts, [key]: val };
    setPassOpts(next);
    setBatch([]);
    setResult(generate(mode, next));
  };

  const handleApiFormat = (fmt: ApiFormat) => {
    setApiFormat(fmt);
    setBatch([]);
    setResult(generate(mode, passOpts, fmt, apiBytes));
  };

  const handleApiBytes = (b: number) => {
    setApiBytes(b);
    setBatch([]);
    setResult(generate(mode, passOpts, apiFormat, b));
  };

  const strength = mode !== "uuid" && result ? calcStrength(result) : null;

  return (
    <div
      style={{
        background: "var(--bg-primary)",
        border: "0.5px solid var(--border-light)",
        borderRadius: "var(--radius-xl)",
        padding: "1.75rem",
        width: "100%",
        maxWidth: 560,
        margin: "0 auto",
      }}
    >
      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
        {TAB_LABELS.map(({ id, emoji, label }) => {
          const active = mode === id;
          return (
            <button
              key={id}
              onClick={() => handleModeChange(id)}
              style={{
                flex: 1,
                padding: "8px 4px",
                fontSize: 13,
                fontWeight: 500,
                background: active ? "var(--bg-secondary)" : "transparent",
                border: active
                  ? "0.5px solid var(--border-medium)"
                  : "0.5px solid var(--border-light)",
                borderRadius: "var(--radius-md)",
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
              }}
            >
              {emoji} {label}
            </button>
          );
        })}
      </div>

      {/* Result box */}
      <div
        style={{
          background: "var(--bg-secondary)",
          border: "0.5px solid var(--border-light)",
          borderRadius: "var(--radius-lg)",
          padding: "1.125rem 1.25rem",
          marginBottom: "1rem",
          minHeight: 60,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            color: "var(--text-primary)",
            wordBreak: "break-all",
            flex: 1,
            lineHeight: 1.7,
          }}
        >
          {result || (
            <span style={{ color: "var(--text-secondary)" }}>
              Click Generate…
            </span>
          )}
        </span>
        {result && <CopyButton value={result} />}
      </div>

      {/* Strength bar */}
      {strength && (
        <div style={{ marginBottom: "1.25rem" }}>
          <StrengthBar
            score={strength.score}
            level={strength.level}
            label={strength.label}
          />
        </div>
      )}

      {/* Password options */}
      {mode === "password" && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: "1.25rem",
            }}
          >
            {(
              [
                { key: "upper", label: "Uppercase (A-Z)" },
                { key: "lower", label: "Lowercase (a-z)" },
                { key: "digits", label: "Digits (0-9)" },
                { key: "symbols", label: "Symbols (!@#$…)" },
              ] as { key: keyof PasswordOptions; label: string }[]
            ).map(({ key, label }) => (
              <label
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={passOpts[key] as boolean}
                  onChange={(e) => handlePassOpt(key, e.target.checked)}
                />
                {label}
              </label>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: "1.25rem",
            }}
          >
            <span
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                whiteSpace: "nowrap",
              }}
            >
              Length:
            </span>
            <input
              type="range"
              min={8}
              max={64}
              step={1}
              value={passOpts.length}
              onChange={(e) => handlePassOpt("length", Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                minWidth: 28,
                textAlign: "right",
              }}
            >
              {passOpts.length}
            </span>
          </div>
        </>
      )}

      {/* API Key options */}
      {mode === "api" && (
        <>
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: "1.25rem",
              flexWrap: "wrap",
            }}
          >
            {API_FORMATS.map(({ id, label }) => {
              const active = apiFormat === id;
              return (
                <button
                  key={id}
                  onClick={() => handleApiFormat(id)}
                  style={{
                    padding: "5px 14px",
                    fontSize: 12,
                    fontWeight: 500,
                    border: active
                      ? "0.5px solid var(--border-medium)"
                      : "0.5px solid var(--border-light)",
                    borderRadius: 20,
                    background: active ? "var(--bg-secondary)" : "transparent",
                    color: active ? "var(--text-primary)" : "var(--text-secondary)",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: "1.25rem",
            }}
          >
            <span
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                whiteSpace: "nowrap",
              }}
            >
              Bytes:
            </span>
            <input
              type="range"
              min={16}
              max={64}
              step={8}
              value={apiBytes}
              onChange={(e) => handleApiBytes(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                minWidth: 28,
                textAlign: "right",
              }}
            >
              {apiBytes}
            </span>
          </div>
        </>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={handleGenerate}
          style={{
            flex: 1,
            padding: "10px",
            fontSize: 14,
            fontWeight: 500,
            border: "0.5px solid var(--border-medium)",
            borderRadius: "var(--radius-md)",
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
          }}
        >
          ↻ Generate
        </button>
        <button
          onClick={handleBatch}
          style={{
            padding: "10px 20px",
            fontSize: 14,
            border: "0.5px solid var(--border-light)",
            borderRadius: "var(--radius-md)",
            background: "var(--bg-secondary)",
            color: "var(--text-secondary)",
          }}
        >
          × 5
        </button>
      </div>

      {/* Batch results */}
      {batch.length > 0 && (
        <div
          style={{
            marginTop: "1rem",
            background: "var(--bg-secondary)",
            border: "0.5px solid var(--border-light)",
            borderRadius: "var(--radius-lg)",
            padding: "1rem 1.25rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              5 variants
            </span>
            <CopyButton value={batch.join("\n")} label="Copy all" small />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {batch.map((v, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  paddingBottom: i < batch.length - 1 ? 6 : 0,
                  borderBottom:
                    i < batch.length - 1
                      ? "0.5px solid var(--border-light)"
                      : "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: "var(--text-primary)",
                    flex: 1,
                    wordBreak: "break-all",
                    lineHeight: 1.6,
                  }}
                >
                  {v}
                </span>
                <CopyButton value={v} label="copy" small />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
