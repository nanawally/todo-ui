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
} from "@/app/_service/taskservice"

type TaskFetcher = () => Promise<Task[]>

export default function Page() {
  const [tasks, setTasks] = useState<Task[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState("")
  const [searchMode, setSearchMode] = useState<"name" | "tag">("name")

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
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="p-4">
        {/* Input field for search */}
        <div className="mb-2">
          <input
            type="text"
            placeholder={`Enter task ${searchMode}`}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="px-2 py-1 border rounded w-64"
          />

          {/* Mode selector */}
          <select
            value={searchMode}
            onChange={(e) => setSearchMode(e.target.value as "name" | "tag")}
            className="ml-2 px-2 py-1 border rounded"
          >
            <option value="name">Name</option>
            <option value="tag">Tag</option>
          </select>
        </div>

        <div className="mb-4 space-x-2">
          {Object.entries(fetcher).map(([label, fetcher]) => (
            <button
              key={label}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => handleClick(fetcher)}
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
      </div>
    </>
  )
}
