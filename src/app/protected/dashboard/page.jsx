// File: src/app/protected/dashboard/page.jsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/useQuizStore";
import Button from "@/components/Button";
import Input from "@/components/Input";
import "@/styles/components/dashboard.scss";

export default function SavedQuizPage() {
  const router = useRouter();
  const { quizzes, deleteQuiz } = useQuizStore();

  const handleGenerateNew = () => {
    router.push("/quiz");
  };

  return (
    <main className="ppage dashboard">
      {/* Welcome Section */}
      <section className="dashboard__welcome">
        <h1 className="dashboard__title">Hej, Användare! 👋</h1>
        <p className="dashboard__subtitle">
          Välkommen till <strong>Quizoteket</strong>! Här kan du hantera dina
          sparade quiz eller skapa nya.
        </p>
        <Button type="primary" size="lg" onClick={handleGenerateNew}>
          ➕ Generera nytt Quiz
        </Button>
      </section>

      {/* Saved Quizzes */}
      <section className="dashboard__pinned">
        <h2 className="dashboard__section-title">📌 Sparade Quiz</h2>

        {quizzes.length === 0 ? (
          <p className="dashboard__empty">Du har inga sparade quiz ännu.</p>
        ) : (
          <div className="dashboard__pinned-list">
            {quizzes.map((quiz) => (
              <div className="quiz-card" key={quiz.id}>
                <h3 className="quiz-card__title">{quiz.title}</h3>
                <p className="quiz-card__desc">
                  {quiz.questions.length} frågor • {quiz.category}
                </p>
                <div className="quiz-card__actions">
                  <Button
                    type="primary"
                    size="sm"
                    onClick={() => router.push(`/quiz/${quiz.id}`)}
                  >
                    Spela
                  </Button>
                  <Button
                    type="ghost"
                    size="sm"
                    onClick={() => deleteQuiz(quiz.id)}
                  >
                    🗑 Radera
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
