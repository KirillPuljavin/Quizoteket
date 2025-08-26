// File: src/app/quiz/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/Button";
import "@/styles/components/quiz.scss";

export default function QuizPage() {
  // === Stage control ===
  const [stage, setStage] = useState("loading"); // "loading" | "quiz" | "result"
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(90); // 90s placeholder timer

  // === Fake quiz ===
  const quiz = {
    title: "AI & Maskininlärning",
    description: "Testa dina kunskaper om AI, maskininlärning och algoritmer.",
    questions: [
      {
        id: 1,
        question: "Vilken algoritm används ofta för bildklassificering?",
        options: [
          "Linear Regression",
          "Convolutional Neural Networks",
          "K-Means",
          "SVM",
        ],
      },
      {
        id: 2,
        question: "Vilket språk används mest för maskininlärning?",
        options: ["Python", "C++", "Java", "Rust"],
      },
      {
        id: 3,
        question: "Vilket begrepp beskriver överanpassning av en modell?",
        options: ["Overfitting", "Underfitting", "Regularization", "Dropout"],
      },
    ],
  };

  const totalSteps = quiz.questions.length;

  // === Simulate quiz generation ===
  useEffect(() => {
    const timer = setTimeout(() => {
      setStage("quiz");
    }, 1800); // 1.8s fake load
    return () => clearTimeout(timer);
  }, []);

  // === Timer logic ===
  useEffect(() => {
    if (stage !== "quiz") return;
    if (timeLeft === 0) {
      setStage("result");
      return;
    }
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [stage, timeLeft]);

  const handleSelectOption = (qid, option) => {
    setAnswers((prev) => ({ ...prev, [qid]: option }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setStage("result");
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentStep(0);
    setTimeLeft(90);
    setStage("quiz");
  };

  return (
    <main className="quiz">
      {/* === Stage 1: Loading / Generation === */}
      {stage === "loading" && (
        <section className="quiz__loading">
          <div className="quiz__spinner" />
          <p className="quiz__loading-text">Genererar quizet åt dig...</p>
          <div className="quiz__dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        </section>
      )}

      {/* === Stage 2: Main Quiz === */}
      {stage === "quiz" && (
        <>
          <section className="quiz__header">
            <h1 className="quiz__title">{quiz.title}</h1>
            <p className="quiz__description">{quiz.description}</p>
            <div className="quiz__meta">
              <span className="quiz__progress">
                Fråga {currentStep + 1} / {totalSteps}
              </span>
              <span className="quiz__timer">
                ⏳ {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            </div>
          </section>

          {/* Question block */}
          <section className="quiz__question-block">
            <h2 className="quiz__question">
              {quiz.questions[currentStep].question}
            </h2>
            <div className="quiz__options">
              {quiz.questions[currentStep].options.map((option, i) => (
                <button
                  key={i}
                  className={`quiz__option ${
                    answers[quiz.questions[currentStep].id] === option
                      ? "quiz__option--selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleSelectOption(quiz.questions[currentStep].id, option)
                  }
                >
                  {option}
                </button>
              ))}
            </div>
          </section>

          {/* Navigation */}
          <section className="quiz__navigation">
            <Button
              type="primary"
              size="md"
              onClick={handleNext}
              disabled={!answers[quiz.questions[currentStep].id]}
            >
              {currentStep === totalSteps - 1 ? "Slutför Quiz" : "Nästa"}
            </Button>
          </section>
        </>
      )}

      {/* === Stage 3: Results === */}
      {stage === "result" && (
        <section className="quiz__results">
          <h2 className="quiz__results-title">Resultat</h2>
          <p className="quiz__results-subtitle">
            Du fick <strong>2/3</strong> rätt! Bra jobbat! 🎉
          </p>

          <div className="quiz__results-breakdown">
            {quiz.questions.map((q, i) => (
              <div key={q.id} className="quiz__results-item">
                <h3 className="quiz__results-question">
                  {i + 1}. {q.question}
                </h3>
                <p>
                  Ditt svar:{" "}
                  <span className="quiz__results-user">
                    {answers[q.id] || "—"}
                  </span>
                </p>
                <p>
                  Korrekt svar:{" "}
                  <span className="quiz__results-correct">
                    {q.options[1]} {/* placeholder correct */}
                  </span>
                </p>
              </div>
            ))}
          </div>

          <div className="quiz__results-actions">
            <Button type="primary" size="md" onClick={handleRestart}>
              Spela igen
            </Button>
            <Button type="secondary" size="md">
              📌 Pinna quiz
            </Button>
          </div>
        </section>
      )}
    </main>
  );
}
