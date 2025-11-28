import { TaskDTO } from "../_types/TaskDTO"

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

export async function getTaskByName(name: string) {
  const res = await fetch(`${BASE_URL}/search/name/${name}`, {
    credentials: "include",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch tasks")
  }

  return res.json()
}

export async function getTaskByTag(tag: string) {
  const res = await fetch(`${BASE_URL}/tag/${tag}`, {
    credentials: "include",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch tasks")
  }

  return res.json()
}

export async function getTaskByPriority() {
  const res = await fetch(`${BASE_URL}/sort/priority`, {
    credentials: "include",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch tasks")
  }

  return res.json()
}

export async function getTaskByNoPriority() {
  const res = await fetch(`${BASE_URL}/sort/no-priority`, {
    credentials: "include",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch tasks")
  }

  return res.json()
}

export async function createTask(task: TaskDTO) {
  const res = await fetch(`${BASE_URL}/new`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  })

  if (!res.ok) {
    throw new Error(`Failed to create task: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

/*export async function deleteTask(id) {
  return fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
}*/
