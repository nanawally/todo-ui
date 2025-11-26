import { Task } from "@/app/_types/Task";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const newTask: Task = { // dummy values
      id: "00000000-0000-0000-0000-000000000000",
      userId: "00000000-0000-0000-0000-000000000000",
      name: "Example task",
      description: null,
      completed: false,
      priority: "LOW",
      tags: [],
    };
    
    return NextResponse.json(newTask);
  } catch (error) {
    return NextResponse.error();
  }
}
