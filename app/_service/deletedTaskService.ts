const BASE_URL = "http://localhost:8090/v2/trashcan"

export async function getAllDeletedTasks() {
  const res = await fetch(`${BASE_URL}/`, {
    credentials: "include",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch tasks")
  }

  return res.json()
}

export async function getDeletedTaskByTag(tag: string) {
  const res = await fetch(`${BASE_URL}/tag/${tag}`, {
    credentials: "include",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch tasks")
  }

  return res.json()
}

export async function deleteTaskById(id: string) {
  const res = await fetch(`${BASE_URL}/delete/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!res.ok) {
    throw new Error("Failed to delete task")
  }
  return res
}

export async function deleteAllTasks() {
  const res = await fetch(`${BASE_URL}/delete/all`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!res.ok) {
    throw new Error("Failed to delete all tasks")
  }
  return res
}

export async function restoreTaskById(id: string) {
  const res = await fetch(`${BASE_URL}/restore/${id}`, {
    method: "PUT",
    credentials: "include",
  })
  if (!res.ok) {
    throw new Error("Failed to restore task")
  }
  return res.text()
}
