"use client";

import { useState } from "react";

type Props = {
  value: string;
  label?: string;
  small?: boolean;
};

export default function CopyButton({ value, label = "Copy", small }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        flexShrink: 0,
        padding: small ? "3px 8px" : "6px 14px",
        fontSize: small ? 11 : 12,
        fontWeight: 500,
        background: "var(--bg-primary)",
        border: "0.5px solid var(--border-medium)",
        borderRadius: "var(--radius-md)",
        color: copied ? "#1D9E75" : "var(--text-secondary)",
        whiteSpace: "nowrap",
        transition: "color 0.2s",
      }}
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}
