"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRequireAuth } from "@/app/_hooks/useRequireAuth";

type Status = "idle" | "loading" | "success" | "error";

export default function Page() {
  const checkingAuth = useRequireAuth("https://auth-microservice-mcep.onrender.com/auth/check");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const logout = async () => {
    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("https://auth-microservice-mcep.onrender.com/auth/logout", {
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
        setStatus("error");
        return;
      }

      localStorage.clear();
      setStatus("success");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError("Network error: backend unreachable");
      setStatus("error");
    }
  };

  if (checkingAuth !== false) return null;

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

      {status === "loading" && <p>Processing logout...</p>}
      {status === "error" && error && <p className="text-red-500">{error}</p>}
      {status === "success" && (
        <p className="text-green-500">
          Logged out! You may now close the page or log in again.
        </p>
      )}
    </div>
  );
}
