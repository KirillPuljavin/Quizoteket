"use client";
import { useState } from "react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    // TODO: Replace with real auth later
    if (email.trim() && password.trim()) {
      setIsLoggedIn(true);
    }
  }

  return (
    <section>
      {!isLoggedIn ? (
        <div
          style={{
            maxWidth: "400px",
            margin: "2rem auto",
            padding: "2rem",
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          }}
        >
          <h2>Logga in</h2>
          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <input
              type="email"
              placeholder="E-post"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <input
              type="password"
              placeholder="Lösenord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "0.6rem",
                background: "#18181b",
                color: "#fff",
                fontWeight: "bold",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Logga in
            </button>
          </form>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <h1>Välkommen till Quizoteket 🎉</h1>
          <p>Här kan du skapa AI-genererade quiz och utmana dina vänner.</p>
          <button
            style={{
              marginTop: "1rem",
              padding: "0.7rem 1.5rem",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Skapa quiz
          </button>
        </div>
      )}
    </section>
  );
}
