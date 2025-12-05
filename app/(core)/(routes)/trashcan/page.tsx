"use client";

import { DeletedTask } from "@/app/_types/DeletedTask";
import { useEffect, useState } from "react";
import { useRequireAuth } from "@/app/_hooks/useRequireAuth";
import {
  getAllDeletedTasks,
  getDeletedTaskByTag,
  deleteTaskById,
  deleteAllTasks,
  restoreTaskById,
} from "@/app/_service/deletedTaskService";

type DeletedTaskFetcher = () => Promise<DeletedTask[]>;

export default function Page() {
  const checkingAuth = useRequireAuth("http://localhost:8090/v2/trashcan/");
  const [tasks, setTasks] = useState<DeletedTask[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");

  const fetcher: Record<string, DeletedTaskFetcher> = {
    "All Deleted Tasks": getAllDeletedTasks,
  };

  const handleClick = async (fetchFn: DeletedTaskFetcher) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFn();
      setTasks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (checkingAuth !== false) return;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getAllDeletedTasks();
        setTasks(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [checkingAuth]);

  const handleRestoreOne = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await restoreTaskById(id);
      setTasks((prev) => prev?.filter((t) => t.id !== id) ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOne = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await deleteTaskById(id);
      setTasks((prev) => prev?.filter((t) => t.id !== id) ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    setLoading(true);
    setError(null);

    try {
      await deleteAllTasks();
      setTasks([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth === null) return null;
  if (loading) return <p>Loading...</p>;

  return (
    <div className=" m-0 p-5 flex flex-col items-center space-y-4">
      <h1 className=" font-bold text-3xl text-[#453688]">Your Trashcan</h1>
      {/* Tag Search Input */}
      <div className="flex flex-row space-x-3">
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
            className="px-4 py-2 bg-[#BFDBF7] rounded hover:border-[#646cff]"
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
        <div className="mt-5 font-serif w-full">
          <div className="flex flex-wrap gap-5 justify-evenly items-start w-full">
            {tasks
              .filter((task) =>
                searchValue.trim() === ""
                  ? true
                  : task.tags.some((t) =>
                      t.tagName
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
                    )
              )
              .map((task) => (
                <div
                  key={task.id}
                  className="w-[300px] p-3 font-serif border border-gray-300 rounded-[30px] 
                       text-[#034780] bg-[#FFF9BF] bg-opacity-80"
                >
                  <p>
                    <strong>Name:</strong> {task.name}
                  </p>
                  <p>
                    <strong>Description:</strong> {task.description}
                  </p>
                  <p>
                    <strong>Priority:</strong> {task.priority}
                  </p>
                  <p>
                    <strong>Tags:</strong>{" "}
                    {task.tags.map((t) => t.tagName).join(", ")}
                  </p>

                  <div className="mt-2 flex gap-2">
                    <button
                      className="px-3 py-1  text-white bg-[#FFB2E6] rounded-[30px] hover:bg-green-500 "
                      onClick={() => handleRestoreOne(task.id)}
                    >
                      Restore
                    </button>
                    
                    <button
                      className="px-3 py-1  text-white bg-[#FFB2E6] rounded-[30px] hover:bg-red-500 "
                      onClick={() => handleDeleteOne(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
