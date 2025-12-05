const BASE_URL = "https://todo-microservice-6lak.onrender.com/v2/trashcan"

export async function getAllDeletedTasks() {
  const res = await fetch(`${BASE_URL}/`, {
    credentials: "include",
  })

  if (res.status === 204) {
    return []
  }

  if (!res.ok) {
    throw new Error("Failed to fetch tasks")
  }

  return res.json()
}

export async function getDeletedTaskByTag(tag: string) {
  const res = await fetch(`${BASE_URL}/tag/${tag}`, {
    credentials: "include",
  })

  if (res.status === 204) {
    return []
  }

  if (!res.ok) {
    throw new Error("Failed to fetch tasks")
  }

  return res.json()
}

export async function restoreTaskById(id: string) {
  const res = await fetch(`${BASE_URL}/restore/${id}`, {
    method: "PUT",
    credentials: "include",
  })

  if (res.status === 404) {
    throw new Error("Task not found")
  }

  if (!res.ok) {
    throw new Error("Failed to restore task")
  }
  return res.text()
}

export async function deleteTaskById(id: string) {
  const res = await fetch(`${BASE_URL}/delete/${id}`, {
    method: "DELETE",
    credentials: "include",
  })

  if (res.status === 404) {
    throw new Error("Task not found")
  }
  
  if (res.status === 204) {
    return "Task successfully deleted"
  }
  
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

  if (res.status === 204) {
    return "Trashcan successfully emptied"
  }

  if (res.status === 404) {
    const message = await res.text();
    throw new Error(message);
  }

  if (!res.ok) {
    throw new Error("Failed to delete all tasks")
  }

  return res
}
