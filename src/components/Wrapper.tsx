// File: src/components/Wrapper.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import "@/styles/components/wrapper.scss";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser, logout } = useAuthStore();

  const isActive = (path: string) =>
    pathname === path ? "header__link header__link--active" : "header__link";

  return (
    <div className="wrapper">
      {/* === Header === */}
      <header className="header">
        <div className="header__container">
          {/* Logo */}
          <Link href="/" className="header__logo">
            Quizoteket
          </Link>

          {/* Navigation */}
          <nav className="header__nav">
            <Link
              href="/protected/dashboard"
              className={isActive("/protected/dashboard")}
            >
              Dashboard
            </Link>
            <Link
              href="/protected/quiz"
              className={isActive("/protected/quiz")}
            >
              Quiz
            </Link>
            <Link
              href="/protected/leaderboard"
              className={isActive("/protected/leaderboard")}
            >
              Ledartavla
            </Link>
          </nav>

          {/* Auth / Profile */}
          <div className="header__actions">
            {!currentUser ? (
              <Link href="/login" className="btn btn--primary btn--sm">
                Logga in
              </Link>
            ) : (
              <div className="header__profile">
                <span className="header__username">{currentUser}</span>
                <button
                  onClick={logout}
                  className="btn btn--secondary btn--sm header__logout"
                >
                  Logga ut
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* === Main Content === */}
      <main className="main">{children}</main>

      {/* === Footer === */}
      <footer className="footer">
        <div className="footer__container">
          <p className="footer__copy">
            &copy; {new Date().getFullYear()} Quizoteket. Alla rättigheter
            förbehållna.
          </p>
          <nav className="footer__nav">
            <Link href="/about" className="footer__link">
              Om oss
            </Link>
            <Link href="/privacy" className="footer__link">
              Integritetspolicy
            </Link>
            <Link href="/contact" className="footer__link">
              Kontakt
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
