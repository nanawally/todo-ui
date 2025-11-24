/**
 * A safe API helper:
 * - Handles HTTP errors
 * - Handles invalid JSON
 * - Handles null JSON
 * - Handles API logic failures (success: false)
 * - Returns typed data or null
 *
 * Improvements added:
 * - Supports POST, PUT, DELETE, GET via RequestInit
 * - Automatically includes cookies (required for Spring Boot JWT)
 * - Automatically redirects to /login on 401/403 (expired token)
 * - Accepts extra fetch options
 */

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T | null> {
  let res: Response

  try {
    // FETCH (network + HTTP errors)
    res = await fetch(url, {
      credentials: "include", // Include cookies for JWT auth
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    })
  } catch (networkError) {
    console.error("Network error:", networkError)
    return null
  }

  // EXPIRED / INVALID TOKEN
  if (res.status === 401 || res.status === 403) {
    console.warn("Session expired. Redirecting to login…")
    window.location.href = "/login" // Client-side redirect
    return null
  }

  // HTTP ERROR
  if (!res.ok) {
    console.error("HTTP Error:", res.status, res.statusText)
    return null
  }

  // SAFE JSON PARSE
  let json: any
  try {
    json = await res.json()
  } catch (err) {
    console.error("Response is not valid JSON:", err)
    return null
  }

  // JSON IS NULL
  if (json == null) {
    console.error("JSON is null or undefined")
    return null
  }

  // API LOGIC FAILED (if your API uses success/error)
  if (json.success === false) {
    console.error("API logic error:", json.error)
    return null
  }

  // RETURN EITHER json.data OR JUST json
  return (json.data ?? json) as T
}