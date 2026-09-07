"use client";

/**
 * Dernier filet de sécurité : capture les erreurs du layout racine
 * lui-même. Il remplace <html>/<body>, donc les styles globaux ne sont pas
 * garantis — on reste sur des styles inline.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          background: "#0a0a0a",
          color: "#f4f4f5",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          textAlign: "center",
          padding: "1.5rem",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 600, margin: 0 }}>
          Something went wrong
        </h1>
        <p style={{ color: "#a8a8b3", maxWidth: "32rem", margin: 0 }}>
          The application failed to load. Please refresh the page.
          {error.digest ? ` (digest ${error.digest})` : ""}
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "0.5rem",
            padding: "0.65rem 1.4rem",
            borderRadius: "999px",
            border: "none",
            background: "#f4f4f5",
            color: "#0a0a0a",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
