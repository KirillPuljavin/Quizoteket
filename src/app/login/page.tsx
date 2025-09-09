// File: src/app/login/page.tsx
"use client";

import React, {
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
  type ReactElement,
} from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useAuthStore } from "@/store/useAuthStore";
import "@/styles/components/login.scss";

type Mode = "login" | "register";

interface FormState {
  username: string;
  password: string;
  confirm: string;
}

interface FieldErrors {
  username?: string;
  password?: string;
  confirm?: string;
  general?: string;
}

export default function LoginRegisterPage(): ReactElement {
  const router = useRouter();

  const users = useAuthStore((s) => s.users);
  const login = useAuthStore((s) => s.login);
  const signUp = useAuthStore((s) => s.signUp);

  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState<FormState>({
    username: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});

  const resetErrors = (): void => setErrors({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if ((errors as Record<string, unknown>)[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
    }
  };

  const userExists = useMemo<boolean>(
    () => users.some((u) => u.username === form.username.trim()),
    [users, form.username]
  );

  const validateLogin = (): boolean => {
    const next: FieldErrors = {};
    if (!form.username.trim()) next.username = "Ange användarnamn.";
    if (!form.password) next.password = "Ange lösenord.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateRegister = (): boolean => {
    const next: FieldErrors = {};
    if (!form.username.trim()) next.username = "Ange användarnamn.";
    if (!form.password) next.password = "Välj ett lösenord.";
    if (!form.confirm) next.confirm = "Bekräfta ditt lösenord.";
    if (form.password && form.confirm && form.password !== form.confirm) {
      next.confirm = "Lösenorden matchar inte.";
    }
    if (form.username.trim() && userExists) {
      next.username = "Användarnamnet är upptaget.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    resetErrors();

    if (mode === "login") {
      if (!validateLogin()) return;
      const ok = login(form.username.trim(), form.password);
      if (!ok) {
        if (!userExists) {
          setErrors({
            username: "Kontot finns inte. Skapa ett nytt konto.",
            general: "Okänt användarnamn.",
          });
        } else {
          setErrors({
            password: "Fel lösenord. Försök igen.",
            general: "Inloggningen misslyckades.",
          });
        }
        return;
      }
      router.push("/quiz");
    } else {
      if (!validateRegister()) return;
      const created = signUp(form.username.trim(), form.password);
      if (!created) {
        setErrors({
          username: "Användarnamnet är upptaget.",
          general: "Registreringen misslyckades.",
        });
        return;
      }
      router.push("/quiz");
    }
  };

  const switchMode = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    setMode((m) => (m === "login" ? "register" : "login"));
    setForm({ username: form.username, password: "", confirm: "" });
    resetErrors();
  };

  const continueAsGuest = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    router.push("/quiz");
  };

  return (
    <div className="page login">
      <section className="login__content">
        <h1 className="home__title">Quizoteket</h1>
        <p className="home__subtitle">
          Skapa, spela och tävla i AI-genererade quiz!
        </p>

        <div className="login__toggle">
          <Button onClick={switchMode} size="sm" className="is-secondary">
            {mode === "login" ? "Skapa nytt konto" : "Har konto? Logga in"}
          </Button>
        </div>

        <form className="login__form" onSubmit={handleSubmit} noValidate>
          <div className="login__field">
            <Input
              label="Användarnamn"
              type="text"
              name="username"
              placeholder="Ange användarnamn"
              value={form.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
            {errors.username && (
              <p className="login__error">{errors.username}</p>
            )}
          </div>

          <div className="login__field">
            <Input
              label="Lösenord"
              type="password"
              name="password"
              placeholder={mode === "login" ? "Ange lösenord" : "Välj lösenord"}
              value={form.password}
              onChange={handleChange}
              required
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
            />
            {errors.password && (
              <p className="login__error">{errors.password}</p>
            )}
          </div>

          {mode === "register" && (
            <div className="login__field">
              <Input
                label="Bekräfta lösenord"
                type="password"
                name="confirm"
                placeholder="Upprepa lösenord"
                value={form.confirm}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              {errors.confirm && (
                <p className="login__error">{errors.confirm}</p>
              )}
            </div>
          )}

          {errors.general && <p className="login__error">{errors.general}</p>}

          <Button type="submit" size="md" onClick={undefined}>
            {mode === "login" ? "Logga in" : "Skapa konto"}
          </Button>
        </form>

        <div className="login__actions">
          <Button onClick={continueAsGuest} size="sm" className="is-ghost">
            Fortsätt som gäst
          </Button>
        </div>
      </section>
    </div>
  );
}
