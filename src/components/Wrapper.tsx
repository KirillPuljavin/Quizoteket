// File: src/components/Wrapper.tsx
"use client";

import Link from "next/link";
import Button from "@/components/Button";
import { usePathname } from "next/navigation";
import { useState } from "react";
import "@/styles/components/wrapper.scss";

export default function Wrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<null | { name: string; avatar: string }>(
    null
  );

  const isActive = (path: string) =>
    pathname === path ? "header__link header__link--active" : "header__link";

  const handleLogin = () =>
    setUser({
      name: "SFG",
      avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=SFG",
    });

  const handleLogout = () => setUser(null);

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
            <Link href="/dashboard" className={isActive("/dashboard")}>
              Dashboard
            </Link>
            <Link href="/quiz" className={isActive("/quiz")}>
              Quiz
            </Link>
            <Link href="/leaderboard" className={isActive("/leaderboard")}>
              Ledartavla
            </Link>
          </nav>

          {/* Auth / Profile */}
          <div className="header__actions">
            {!user ? (
              <>
                <Button type="primary" size="sm" onClick={handleLogin}>
                  Logga in
                </Button>
                <Button type="secondary" size="sm">
                  Skapa konto
                </Button>
              </>
            ) : (
              <div className="header__profile">
                <button className="header__avatar-btn">
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="header__avatar"
                  />
                  <span className="header__username">{user.name}</span>
                </button>
                <div className="header__dropdown">
                  <Link href="/profile" className="header__dropdown-item">
                    Min profil
                  </Link>
                  <Link href="/settings" className="header__dropdown-item">
                    Inställningar
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="header__dropdown-item header__dropdown-logout"
                  >
                    Logga ut
                  </button>
                </div>
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
