import KeyGen from "@/components/KeyGen";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: 560, marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: 6,
            letterSpacing: "-0.02em",
          }}
        >
          KeyGen
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>
          Generate cryptographically secure passwords, API keys, and UUIDs.
          All generation happens locally in your browser — nothing leaves your device.
        </p>
      </div>

      <KeyGen />

      <footer
        style={{
          marginTop: "2.5rem",
          fontSize: 12,
          color: "var(--text-secondary)",
          textAlign: "center",
          lineHeight: 1.7,
        }}
      >
        <div>
          Uses{" "}
          <code
            style={{
              fontFamily: "var(--font-mono)",
              background: "var(--bg-secondary)",
              padding: "1px 5px",
              borderRadius: 4,
              fontSize: 11,
            }}
          >
            crypto.getRandomValues()
          </code>{" "}
          — no server, no tracking.
        </div>
        <div>
          Copyright &copy; 2026 Ruslan Huzii. MIT License.
        </div>
      </footer>
    </main>
  );
}
