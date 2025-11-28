"use client"

import { Task } from "@/app/_types/Task"
import { use, useEffect, useState } from "react"
import { getAllUncompletedTasks, getAllTasks } from "@/app/_service/taskservice"

type TaskFetcher = () => Promise<Task[]>

export default function Page() {
  /*const [uncompletedTasks, setUncompletedTasks] = useState<Task[] | null>(null)
  const [allTasks, setAllTasks] = useState<Task[] | null>(null)*/
  const [tasks, setTasks] = useState<Task[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetcher: Record<string, TaskFetcher> = {
    "All Tasks": getAllTasks,
    "Uncompleted Tasks": getAllUncompletedTasks,
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
  /*useEffect(() => {
    async function loadData() {
      try {
        const [uncompletedTasks, allTasks] = await Promise.all([
          getAllUncompletedTasks(),
          getAllTasks(),
        ])

        setUncompletedTasks(uncompletedTasks)
        setAllTasks(allTasks)
      } catch (err: any) {
        setError(err.message)
      }
    }
    loadData()
  }, [])

  if (error) {
    return <div>Error: {error}</div>
  }
  if (!uncompletedTasks || !allTasks) {
    return <div>Loading...</div>
  }*/

  return (
    <div className="p-4">
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
  )
}
