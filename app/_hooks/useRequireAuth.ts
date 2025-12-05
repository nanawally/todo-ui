"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useRequireAuth(endpoint: string) {
    const [checkingAuth, setCheckingAuth] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(endpoint, { credentials: "include" });
        if (res.status === 401 || res.status === 403) {
          router.push("/login");
          return;
        }
        setCheckingAuth(false); // authenticated
      } catch {
        router.push("/login");
      }
    };

    checkAuth();
  }, [endpoint, router]);

  return checkingAuth;
}