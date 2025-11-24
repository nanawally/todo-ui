import { Product } from "@/app/_types/product"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const newProduct: Product = {
      id: 0,
      name: "",
      price: 0,
    }

    return NextResponse.json(newProduct)
  } catch (error) {
    return NextResponse.error()
  }
}