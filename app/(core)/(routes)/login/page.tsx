"use client";

import { Button } from "@/app/_components/button.component";
import { useState } from "react";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const login = async () => {
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        credentials: "include", // Include Cookies
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errorBody = await res.text(); // try to read message
        setError(errorBody || "Login failed.");
        return;
      }

      const data = await res.json();
      const token = data.token;
      localStorage.setItem("authToken", token);
      console.log(token);
      
      setSuccess(true);
    } catch (err) {
      setError("Network error: backend unreachable");
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto p-6">
      <h1 className="text-xl font-bold">Login</h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 rounded bg-amber-50"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded bg-amber-50"
      />

      <button
        onClick={login}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
      >
        Login
      </button>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Logged in!</p>}
    </div>
  );
}
