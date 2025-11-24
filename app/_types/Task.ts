export interface Product {
  id: number
  name: string
  price: number
  description?: string | null
}
/*

from product/page.tsx
"use client"

import { Product } from "@/app/_types/product"
import { apiFetch } from "@/app/_utility/api"
import { useState } from "react"

export default function Page() {
  const [apiData, setApiData] = useState<Product | null>(null)

  const load = async () => {
    const data = await apiFetch<Product>("/api")
    
    if (!data) return

    setApiData(data)
  }
  
  return (
    <>
      <button onClick={load}>Load Data</button>
      <p>{JSON.stringify(apiData)}</p>
    </>
  )
}


*/