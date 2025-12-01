"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Page() {
  //const router = useRouter(); // always call hook
  const [hydrated, setHydrated] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /*
  // mark hydration complete
  useEffect(() => {
    setHydrated(true);
  }, []);

  // auto-redirect if user not logged in
  useEffect(() => {
    if (!hydrated) return;

    const checkLogin = async () => {
      try {
        const res = await fetch("http://localhost:8080/logout", {
          method: "GET",
          credentials: "include",
        });

        if (res.status === 302 || res.status === 401 || res.status === 403) {
          router.push("/login");
        }
      } catch (err) {
        console.error("Failed to check login:", err);
      }
    };

    checkLogin();
  }, [hydrated, router]);
  */
  const logout = async () => {
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.status === 401 || res.status === 403) {
        router.push("/login");
        return;
      }

      if (!res.ok) {
        const body = await res.text();
        setError(body || "Logout failed.");
        return;
      }

      localStorage.clear();
      setSuccess(true);

      router.push("/login");
    } catch (err) {
      setError("Network error: backend unreachable");
    }
  };

  //if (!hydrated) return null;

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto p-6">
      <h1 className="text-xl font-bold">Logout</h1>

      <p>Are you sure you want to log out?</p>

      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 text-white py-2 rounded"
      >
        Logout
      </button>

      {error && <p className="text-red-500">{error}</p>}
      {success && (
        <p className="text-green-500">
          Logged out! You may now close the page or login again.
        </p>
      )}
    </div>
  );
}
