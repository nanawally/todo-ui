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
  updateTask,
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
  const [newTask, setNewTask] = useState<TaskDTO>({
    name: "",
    description: "",
    completed: false,
    priority: "LOW",
    tags: [],
  })
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const fetcher: Record<string, TaskFetcher> = {
    "All Tasks": getAllTasks,
    "Uncompleted Tasks": getAllUncompletedTasks,
    Search: () =>
      searchMode === "name"
        ? getTaskByName(searchValue)
        : getTaskByTag(searchValue),
    "Sort by Priority": getTaskByPriority,
    "Sort by No Priority": getTaskByNoPriority,
  }

  const handleClick = async (fetcher: TaskFetcher) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetcher()
      setTasks(data)
      setCreating(false)
      setEditingTask(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (task: Task) => {
    setEditingTask(task)
    setCreating(true)
    setNewTask({
      name: task.name,
      description: task.description,
      completed: task.completed,
      priority: task.priority,
      tags: task.tags.map((t) => ({ tagName: t.tagName })),
    })
  }

  const handleSaveTask = async () => {
    if (!newTask.name) {
      setError("Task name is required")
      return
    }

    setLoading(true)
    setError(null)

    try {
      let saved: Task

      if (editingTask) {
        const mergedTask: Task = {
          ...editingTask,
          ...newTask,
          tags:
            newTask.tags?.map((t) => ({
              id: "", 
              tagName: t.tagName,
              taskType: "ACTIVE", 
            })) ?? [],
        }

        saved = await updateTask(editingTask.id!, mergedTask)

        setTasks(tasks?.map((t) => (t.id === saved.id ? saved : t)) ?? [])
        setEditingTask(null)
      } else {
        saved = await createTask(newTask)
        setTasks([saved, ...(tasks ?? [])])
      }

      setCreating(false)
      setEditingTask(null)

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
                onClick={() => handleClick(f)}
              >
                {label}
              </button>
            ))}

            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => {
                setCreating(true)
                setEditingTask(null)
                setNewTask({
                  name: "",
                  description: "",
                  completed: false,
                  priority: "LOW",
                  tags: [],
                })
              }}
            >
              Create New Task
            </button>
          </div>

          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">Error: {error}</div>}

          {tasks && (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 bg-gray-200 rounded flex justify-between items-center"
                >
                  <div>
                    <div className="font-bold">{task.name}</div>
                    <div className="text-sm text-gray-700">
                      {task.description}
                    </div>
                    <div className="text-xs">Priority: {task.priority}</div>
                    <div className="text-xs">
                      Tags: {task.tags.map((t) => t.tagName).join(", ")}
                    </div>
                  </div>

                  <button
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    onClick={() => handleEditClick(task)}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {creating && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="mb-2 font-bold">
            {editingTask ? "Edit Task" : "Create New Task"}
          </h2>

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
            value={newTask.priority}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                priority: e.target.value as Task["priority"],
              })
            }
            className="mb-2 px-2 py-1 border rounded w-64"
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>

          {/* Buttons */}
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
              onClick={() => {
                setCreating(false)
                setEditingTask(null)
              }}
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
