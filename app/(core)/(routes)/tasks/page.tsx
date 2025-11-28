"use client"

import { Task } from "@/app/_types/Task"
import { useState } from "react"
import {
  getAllUncompletedTasks,
  getAllTasks,
  getTaskByName,
  getTaskByTag,
  getTaskByPriority,
  getTaskByNoPriority,
  createTask,
} from "@/app/_service/taskservice"
import { TaskDTO } from "@/app/_types/TaskDTO"

type TaskFetcher = () => Promise<Task[]>

export default function Page() {
  const [tasks, setTasks] = useState<Task[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState("")
  const [searchMode, setSearchMode] = useState<"name" | "tag">("name")
  const [creating, setCreating] = useState(false)
  //const [newTask, setNewTask] = useState<Partial<Task>>({})
  const [newTask, setNewTask] = useState<TaskDTO>({
    name: "",
    description: "",
    completed: false,
    priority: "LOW",
    tags: [],
  })

  const fetcher: Record<string, TaskFetcher> = {
    "All Tasks": getAllTasks,
    "Uncompleted Tasks": getAllUncompletedTasks,
    Search: () =>
      searchMode === "name"
        ? getTaskByName(searchValue)
        : getTaskByTag(searchValue),
    "Sort by Priority": getTaskByPriority,
    "Sort by No Priority": getTaskByNoPriority,
    "Create New Task": async () => {
      setCreating(true)
      return []
    },
  }

  const handleClick = async (fetcher: TaskFetcher, label: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetcher()
      setTasks(data)
      if (label !== "Create New Task") setCreating(false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTask = async () => {
    if (!newTask.name) {
      setError("Task name is required")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const saved = await createTask(newTask)

      setTasks([saved, ...(tasks ?? [])])

      setCreating(false)
      setNewTask({
        name: "",
        description: "",
        completed: false,
        priority: "LOW",
        tags: [],
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      {!creating && (
        <>
          {/* Search input and mode selector */}
          <div className="mb-2">
            <input
              type="text"
              placeholder={`Enter task ${searchMode}`}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="px-2 py-1 border rounded w-64"
            />
            <select
              value={searchMode}
              onChange={(e) => setSearchMode(e.target.value as "name" | "tag")}
              className="ml-2 px-2 py-1 border rounded"
            >
              <option value="name">Name</option>
              <option value="tag">Tag</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="mb-4 space-x-2">
            {Object.entries(fetcher).map(([label, f]) => (
              <button
                key={label}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => handleClick(f, label)}
              >
                {label}
              </button>
            ))}
          </div>

          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">Error: {error}</div>}

          {tasks && (
            <pre className="bg-gray-800 text-white p-2 rounded overflow-x-auto">
              {JSON.stringify(tasks, null, 2)}
            </pre>
          )}
        </>
      )}

      {creating && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="mb-2 font-bold">Create New Task</h2>
          <input
            type="text"
            placeholder="Task name"
            value={newTask.name ?? ""}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            className="mb-2 px-2 py-1 border rounded w-64"
          />
          <input
            type="text"
            placeholder="Description"
            value={newTask.description ?? ""}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
            className="mb-2 px-2 py-1 border rounded w-64"
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={newTask.tags?.map((t) => t.tagName).join(",") ?? ""}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                tags: e.target.value
                  .split(",")
                  .map((t) => ({ tagName: t.trim() })),
              })
            }
            className="mb-2 px-2 py-1 border rounded w-64"
          />
          <select
            value={newTask.priority ?? ""}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                priority: e.target.value as Task["priority"],
              })
            }
            className="mb-2 px-2 py-1 border rounded w-64"
          >
            <option value="">Select Priority</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>

          <div className="space-x-2">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={handleSaveTask}
              disabled={loading}
            >
              Save Task
            </button>
            <button
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setCreating(false)}
            >
              Cancel
            </button>
          </div>

          {loading && <div>Saving...</div>}
          {error && <div className="text-red-500 mt-2">Error: {error}</div>}
        </div>
      )}
    </div>
  )
}
