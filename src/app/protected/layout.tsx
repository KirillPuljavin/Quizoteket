// File: src/app/protected/layout.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = false; // TODO: Replace with real auth check
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [router]);

  return <>{children}</>;
}
