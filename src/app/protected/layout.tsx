// File: src/app/protected/layout.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.currentUser);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!currentUser) {
      router.replace("/login");
    }
  }, [hasHydrated, currentUser, router]);

  if (!hasHydrated) return null;

  return <>{children}</>;
}
