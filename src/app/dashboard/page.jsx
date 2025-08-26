// File: src/app/dashboard/page.jsx
"use client";

import React from "react";
import Button from "@/components/Button";
import "@/styles/components/dashboard.scss";

export default function DashboardPage() {
  const userName = "Användare"; // TODO: replace with real user data

  return (
    <main className="dashboard">
      {/* Welcome Section */}
      <section className="dashboard__welcome">
        <h1 className="dashboard__title">Hej, {userName}! 👋</h1>
        <p className="dashboard__subtitle">
          Välkommen till <strong>Quizoteket</strong>! Utforska quiz, skapa egna
          eller tävla mot andra spelare.
        </p>
      </section>

      {/* Quick Actions */}
      <section className="dashboard__actions">
        <Button type="primary" size="lg">
          Skapa Quiz
        </Button>
        <Button type="secondary" size="lg">
          Bläddra Quiz
        </Button>
        <Button type="accent" size="lg">
          Ledartavla
        </Button>
      </section>

      {/* Pinned Quizzes */}
      <section className="dashboard__pinned">
        <h2 className="dashboard__section-title">📌 Pinned Quiz</h2>
        <div className="dashboard__pinned-list">
          <div className="quiz-card">
            <h3 className="quiz-card__title">Svenska Historia</h3>
            <p className="quiz-card__desc">20 frågor • Medelsvår</p>
            <Button type="primary" size="sm">
              Spela
            </Button>
          </div>

          <div className="quiz-card">
            <h3 className="quiz-card__title">Programmering Basics</h3>
            <p className="quiz-card__desc">15 frågor • Lätt</p>
            <Button type="primary" size="sm">
              Spela
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Quizzes */}
      <section className="dashboard__featured">
        <h2 className="dashboard__section-title">🔥 Populära Quiz</h2>
        <div className="dashboard__featured-grid">
          {["Geografi Europa", "AI & Maskininlärning", "Filmklassiker"].map(
            (title, i) => (
              <div className="quiz-card" key={i}>
                <h3 className="quiz-card__title">{title}</h3>
                <p className="quiz-card__desc">10 frågor • Blandat</p>
                <Button type="secondary" size="sm">
                  Spela
                </Button>
              </div>
            )
          )}
        </div>
      </section>
    </main>
  );
}
