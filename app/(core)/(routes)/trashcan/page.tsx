"use client"

import { DeletedTask } from "@/app/_types/DeletedTask"
import { useEffect, useState } from "react"
import {
  getAllDeletedTasks,
  getDeletedTaskByTag,
  deleteTaskById,
  deleteAllTasks,
} from "@/app/_service/deletedTaskService"

type DeletedTaskFetcher = () => Promise<DeletedTask[]>

export default function Page() {
  const [tasks, setTasks] = useState<DeletedTask[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchValue, setSearchValue] = useState("")
  const [searchMode, setSearchMode] = useState<"tag">("tag")

  const fetcher: Record<string, DeletedTaskFetcher> = {
    "All Deleted Tasks": getAllDeletedTasks,
    Search: () => getDeletedTaskByTag(searchValue),
  }

  const handleClick = async (fetchFn: DeletedTaskFetcher) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchFn()
      setTasks(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await fetcher["All Deleted Tasks"]()
        setTasks(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const handleDeleteOne = async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      await deleteTaskById(id)
      setTasks((prev) => prev?.filter((t) => t.id !== id) ?? null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAll = async () => {
    setLoading(true)
    setError(null)

    try {
      await deleteAllTasks()
      setTasks([])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      {/* Tag Search Input */}
      <div className="mb-2 text-black">
        <input
          type="text"
          placeholder="Search by tag"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="px-2 py-1 border rounded w-64"
        />
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
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={handleDeleteAll}
        >
          Delete All
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}

      {/* Task List */}
      {tasks && (
        <div className="space-y-2">
          {tasks
            .filter((task) =>
              searchValue.trim() === ""
                ? true
                : task.tags.some((t) =>
                    t.tagName.toLowerCase().includes(searchValue.toLowerCase())
                  )
            )
            .map((task) => (
              <div
                key={task.id}
                className="p-3 bg-gray-200 rounded flex justify-between items-center"
              >
                <div>
                  <div className="font-bold text-black">{task.name}</div>
                  <div className="text-black">{task.description}</div>
                  <div className="text-black">Priority: {task.priority}</div>
                  <div className="text-black">
                    Tags: {task.tags.map((t) => t.tagName).join(", ")}
                  </div>
                </div>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={() => handleDeleteOne(task.id)}
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
