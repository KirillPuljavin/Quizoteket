// File: src/app/quiz/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/Button";
import { useQuizStore } from "@/store/useQuizStore";
import "@/styles/components/quiz.scss";

export default function QuizPage() {
  const { addQuiz } = useQuizStore();

  const [stage, setStage] = useState("settings"); // "settings" | "loading" | "quiz" | "result"
  const [quiz, setQuiz] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(90);

  const [settings, setSettings] = useState({
    category: "Historia",
    difficulty: "medium",
    numQuestions: 5,
  });

  const handleChange = (e) => {
    setSettings((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGenerate = async () => {
    setStage("loading");
    try {
      const res = await fetch("/api/generateQuiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (data.error) {
        setStage("settings");
        return;
      }

      setQuiz(data.quiz);
      setStage("quiz");
    } catch {
      setStage("settings");
    }
  };

  // Timer
  useEffect(() => {
    if (stage !== "quiz") return;
    if (timeLeft === 0) {
      setStage("result");
      return;
    }
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [stage, timeLeft]);

  const handleSelectOption = (qid, index) => {
    setAnswers((prev) => ({ ...prev, [qid]: index }));
  };

  const handleNext = () => {
    if (currentStep < quiz.questions.length - 1) {
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

  const handlePin = () => {
    if (quiz) addQuiz(quiz);
  };

  const correctCount =
    quiz?.questions.filter((q) => answers[q.id] === q.correctOption).length ??
    0;

  return (
    <main className="quiz">
      {/* Settings */}
      {stage === "settings" && (
        <section className="quiz__settings">
          <h1>Generera nytt Quiz</h1>
          <label>
            Ämne:
            <input
              type="text"
              name="category"
              value={settings.category}
              onChange={handleChange}
            />
          </label>
          <label>
            Svårighetsgrad:
            <select
              name="difficulty"
              value={settings.difficulty}
              onChange={handleChange}
            >
              <option value="easy">Lätt</option>
              <option value="medium">Medel</option>
              <option value="hard">Svår</option>
            </select>
          </label>
          <label>
            Antal frågor:
            <input
              type="number"
              name="numQuestions"
              value={settings.numQuestions}
              min={3}
              max={15}
              onChange={handleChange}
            />
          </label>
          <Button type="primary" size="md" onClick={handleGenerate}>
            Generera Quiz
          </Button>
        </section>
      )}

      {/* Loading */}
      {stage === "loading" && (
        <section className="quiz__loading">
          <div className="quiz__spinner" />
          <p className="quiz__loading-text">Genererar quizet åt dig...</p>
        </section>
      )}

      {/* Quiz */}
      {stage === "quiz" && quiz && (
        <>
          <section className="quiz__header">
            <h1 className="quiz__title">{quiz.title}</h1>
            <p className="quiz__description">{quiz.description}</p>
            <div className="quiz__meta">
              <span className="quiz__progress">
                Fråga {currentStep + 1} / {quiz.questions.length}
              </span>
              <span className="quiz__timer">
                ⏳ {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            </div>
          </section>

          <section className="quiz__question-block">
            <h2 className="quiz__question">
              {quiz.questions[currentStep].question}
            </h2>
            <div className="quiz__options">
              {quiz.questions[currentStep].options.map((option, i) => (
                <button
                  key={i}
                  className={`quiz__option ${
                    answers[quiz.questions[currentStep].id] === i
                      ? "quiz__option--selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleSelectOption(quiz.questions[currentStep].id, i)
                  }
                >
                  {option}
                </button>
              ))}
            </div>
          </section>

          <section className="quiz__navigation">
            <Button
              type="primary"
              size="md"
              onClick={handleNext}
              disabled={answers[quiz.questions[currentStep].id] == null}
            >
              {currentStep === quiz.questions.length - 1
                ? "Slutför Quiz"
                : "Nästa"}
            </Button>
            <Button type="secondary" size="md" onClick={handlePin}>
              📌 Pinna Quiz
            </Button>
          </section>
        </>
      )}

      {/* Results */}
      {stage === "result" && quiz && (
        <section className="quiz__results">
          <h2 className="quiz__results-title">Resultat</h2>
          <p className="quiz__results-subtitle">
            Du fick {correctCount} av {quiz.questions.length} rätt.
          </p>
          <Button type="primary" size="md" onClick={handleRestart}>
            Spela igen
          </Button>
          <Button type="secondary" size="md" onClick={handlePin}>
            📌 Pinna Quiz
          </Button>
        </section>
      )}
    </main>
  );
}
