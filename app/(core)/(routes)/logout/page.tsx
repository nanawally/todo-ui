"use client";

import { useState } from "react";

export default function Page() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        credentials: "include", // delete cookie
      });

      if (!res.ok) {
        const body = await res.text();
        setError(body || "Logout failed.");
        return;
      }

      // Remove local storage token
      localStorage.removeItem("authToken");
      localStorage.removeItem("jwt");
      localStorage.clear();
      
      setSuccess(true);
    } catch (err) {
      setError("Network error: backend unreachable");
    }
  };

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
