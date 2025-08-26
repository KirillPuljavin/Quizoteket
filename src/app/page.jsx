// File: src/app/page.jsx
"use client";

import React, { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import "@/styles/components/home.scss";

export default function HomePage() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with:", form);
    // TODO: Connect to API endpoint later
  };

  return (
    <main className="home">
      <section className="home__content">
        <h1 className="home__title">Quizoteket</h1>
        <p className="home__subtitle">
          Skapa, spela och tävla i AI-genererade quiz!
        </p>

        <form className="home__form" onSubmit={handleLogin}>
          <Input
            label="E-post"
            type="email"
            name="email"
            placeholder="Ange din e-post"
            value={form.email}
            onChange={handleChange}
          />

          <Input
            label="Lösenord"
            type="password"
            name="password"
            placeholder="Ange lösenord"
            value={form.password}
            onChange={handleChange}
          />

          <Button type="primary" size="md">
            Logga in
          </Button>
        </form>

        <div className="home__actions">
          <Button type="secondary" size="sm">
            Skapa konto
          </Button>
          <Button type="ghost" size="sm">
            Fortsätt som gäst
          </Button>
        </div>
      </section>
    </main>
  );
}
