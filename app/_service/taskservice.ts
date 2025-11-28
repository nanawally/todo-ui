// src/services/tasksService.ts

const BASE_URL = "http://localhost:8090/v2/tasks"

export async function getAllUncompletedTasks() {
  const res = await fetch(`${BASE_URL}/`, {
    credentials: "include",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch tasks")
  }

  return res.json()
}

export async function getAllTasks() {
  const res = await fetch(`${BASE_URL}/all`, {
    credentials: "include",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch tasks")
  }

  return res.json()
}

/*export async function createTask(task) {
  const res = await fetch(`${BASE_URL}/new`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  })
  return res.json()
}

export async function deleteTask(id) {
  return fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
}*/
