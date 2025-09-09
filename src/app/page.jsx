// File: src/app/page.jsx
"use client";

import React from "react";
import Link from "next/link";
import Button from "@/components/Button";
import "@/styles/components/home.scss";

const CATEGORIES = [
  {
    key: "math",
    title: "Mathematic",
    desc: "Sharpen your problem-solving skills with algebra, geometry, and logic puzzles.",
  },
  {
    key: "programming",
    title: "Programming",
    desc: "Test your coding knowledge across languages, concepts, and algorithms.",
  },
  {
    key: "geography",
    title: "World geography",
    desc: "Explore continents, capitals, landmarks, and maps from around the globe.",
  },
  {
    key: "history",
    title: "History",
    desc: "Dive into past events, famous figures, and turning points that shaped our world.",
  },
];

export default function HomePage() {
  return (
    <main className="page home">
      <section className="home__hero">
        <h1 className="home__title">CHALLENGE YOUR MIND</h1>
        <p className="home__subtitle">
          Discover thousands of engaging quizzes,
          <br />
          and test your knowledge across every topic imaginable.
        </p>
        <div className="home__cta">
          <Link href="/protected/quiz">
            <Button> Start a Quiz </Button>
          </Link>
        </div>
      </section>

      <section className="home__categories" aria-labelledby="categories-title">
        <h2 id="categories-title" className="sr-only">
          Popular categories
        </h2>
        <div className="home__grid">
          {CATEGORIES.map(({ key, title, desc }) => (
            <article key={key} className="category-card">
              <h3 className="category-card__title">{title}</h3>
              <p className="category-card__desc">{desc}</p>
              <div className="category-card__actions">
                <Link
                  href={`/protected/quiz?category=${encodeURIComponent(
                    key
                  )}&difficulty=medium&numQuestions=10`}
                >
                  <Button> Quick-start </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
