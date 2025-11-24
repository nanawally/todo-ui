"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AboutPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<string | null>(null)

  useEffect(() => {
    const fetchProtected = async () => {
      const res = await fetch("http://localhost:8080/about", {
        credentials: "include"
      })

      if (res.status === 401 || res.status === 403) {
        router.push("/login")
        return
      }
      
      const text = await res.text()
      setData(text)
      setLoading(false)
    }

    fetchProtected()
  }, [])

  if (loading) return <p>Loading...</p>

  return <div>{data}</div>
}
