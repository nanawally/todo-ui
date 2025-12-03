"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<string[]>([])
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])
    setSuccess(null)

    try {
      const res = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      })

      const data = await res.json()

      if (res.status === 409) {
        setErrors(["Try another username"])
        return
      }

      if (!data.ok) {
        if (Array.isArray(data.message)) setErrors(data.message)
        else setErrors([data.message])
        return
      }

      setSuccess("Registration successful! Redirecting to login...")
      setTimeout(() => router.push("/login"), 2000)
    } catch (err) {
      setErrors(["Network error: backend unreachable"])
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-sm mx-auto p-6">
      <h1 className="text-xl font-bold">Register</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="border px-2 py-1 rounded w-full"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border px-2 py-1 rounded w-full"
          />
        </label>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mt-2"
        >
          Register
        </button>
      </form>

      {errors.length > 0 && (
        <div className="text-red-500">
          <ul>
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {success && <p className="text-green-500">{success}</p>}
    </div>
  )
}
