/* eslint-disable react-hooks/exhaustive-deps */
// File: src/app/protected/quiz/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useQuizStore } from "@/store/useQuizStore";
import "@/styles/components/quiz.scss";

export default function QuizPage() {
  const { addQuiz } = useQuizStore();
  const searchParams = useSearchParams();

  const [stage, setStage] = useState<
    "settings" | "loading" | "quiz" | "result"
  >("settings");
  const [quiz, setQuiz] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [pinned, setPinned] = useState(false);

  const [settings, setSettings] = useState({
    category: "Historia",
    difficulty: "medium",
    numQuestions: 5,
  });

  const handleGenerate = async (preset?: typeof settings) => {
    setStage("loading");
    try {
      const res = await fetch("/api/generateQuiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preset ?? settings),
      });
      const data = await res.json();
      if (data.error) {
        setStage("settings");
        return;
      }
      setQuiz(data.quiz);
      setStage("quiz");
      setPinned(false);
    } catch {
      setStage("settings");
    }
  };

  /* ─── Quick-start params ─────────────────────────────────── */
  useEffect(() => {
    const cat = searchParams.get("category");
    const diff = searchParams.get("difficulty");
    const num = searchParams.get("numQuestions");

    if (cat || diff || num) {
      const preset = {
        category: cat ?? "Historia",
        difficulty: diff ?? "medium",
        numQuestions: num ? parseInt(num, 10) : 10,
      };
      setSettings(preset);
      handleGenerate(preset);
    }
  }, [searchParams]);

  const handleSelectOption = (qid: number, index: number) => {
    setAnswers((prev) => ({ ...prev, [qid]: index }));
  };

  const handleNext = () => {
    if (!quiz) return;
    if (currentStep < quiz.questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setStage("result");
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentStep(0);
    setStage("quiz");
  };

  const handlePin = () => {
    if (quiz && !pinned) {
      addQuiz(quiz);
      setPinned(true);
    }
  };

  const correctCount =
    quiz?.questions.filter((q: any) => answers[q.id] === q.correctOption)
      .length ?? 0;

  return (
    <main className="page quiz">
      {/* Settings */}
      {stage === "settings" && (
        <section className="quiz__settings card flex-col gap-4">
          <h1>Generera nytt Quiz</h1>

          <Input
            label="Ämne"
            type="text"
            value={settings.category}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, category: e.target.value }))
            }
          />

          <div className="input">
            <label className="input__label">Svårighetsgrad</label>
            <select
              title="Difficulty"
              className="input__field"
              value={settings.difficulty}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, difficulty: e.target.value }))
              }
            >
              <option value="easy">Lätt</option>
              <option value="medium">Medel</option>
              <option value="hard">Svår</option>
            </select>
          </div>

          <Input
            label="Antal frågor"
            type="number"
            value={settings.numQuestions}
            min={3}
            max={15}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                numQuestions: parseInt(e.target.value, 10),
              }))
            }
          />

          <Button type="primary" size="md" onClick={() => handleGenerate()}>
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
            </div>
          </section>

          <section className="quiz__question-block">
            <h2 className="quiz__question">
              {quiz.questions[currentStep].question}
            </h2>
            <div className="quiz__options">
              {quiz.questions[currentStep].options.map(
                (option: string, i: number) => {
                  const isSelected =
                    answers[quiz.questions[currentStep].id] === i;
                  return (
                    <button
                      key={i}
                      className={`button button--outline ${
                        isSelected ? "button--selected" : ""
                      }`}
                      onClick={() =>
                        handleSelectOption(quiz.questions[currentStep].id, i)
                      }
                    >
                      {option}
                    </button>
                  );
                }
              )}
            </div>
          </section>

          <section className="quiz__navigation flex gap-4 mt-4">
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

          <div className="quiz__review">
            {quiz.questions.map((q: any) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correctOption;
              return (
                <div
                  key={q.id}
                  className={`quiz__review-item ${
                    isCorrect
                      ? "quiz__review-item--correct"
                      : "quiz__review-item--wrong"
                  }`}
                >
                  <h3 className="quiz__review-question">{q.question}</h3>
                  <ul className="quiz__review-options">
                    {q.options.map((opt: string, i: number) => (
                      <li
                        key={i}
                        className={`quiz__review-option
                          ${
                            i === q.correctOption
                              ? "quiz__review-option--correct"
                              : ""
                          }
                          ${
                            userAnswer === i && userAnswer !== q.correctOption
                              ? "quiz__review-option--chosen-wrong"
                              : ""
                          }`}
                      >
                        {opt}
                        {i === q.correctOption && " ✅"}
                        {userAnswer === i &&
                          userAnswer !== q.correctOption &&
                          " ❌"}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="quiz__results-actions">
            <Button type="primary" size="md" onClick={handleRestart}>
              Spela igen
            </Button>
            <Button
              type="secondary"
              size="md"
              onClick={handlePin}
              disabled={pinned}
            >
              {pinned ? "✅ Pinned" : "📌 Pinna Quiz"}
            </Button>
          </div>
        </section>
      )}
    </main>
  );
}
