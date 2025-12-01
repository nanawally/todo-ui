"use client";

import { Task } from "@/app/_types/Task";
import { useState } from "react";
import {
  getAllUncompletedTasks,
  getAllTasks,
  getTaskByName,
  getTaskByTag,
  getTaskByPriority,
  getTaskByNoPriority,
  createTask,
  updateTask,
  completeTask,
  moveTaskToTrash,
  moveCompletedTasksToTrash,
} from "@/app/_service/taskservice";
import { TaskDTO } from "@/app/_types/TaskDTO";

type TaskFetcher = () => Promise<Task[]>;

export default function Page() {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [searchMode, setSearchMode] = useState<"name" | "tag">("name");
  const [creating, setCreating] = useState(false);
  const [newTask, setNewTask] = useState<TaskDTO>({
    name: "",
    description: "",
    completed: false,
    priority: "LOW",
    tags: [],
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetcher: Record<string, TaskFetcher> = {
    "All Tasks": getAllTasks,
    "Uncompleted Tasks": getAllUncompletedTasks,
    "Sort by Priority": getTaskByPriority,
    "Sort by No Priority": getTaskByNoPriority,
  };
  
  const handleClick = async (fetcher: TaskFetcher) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetcher();
      setTasks(data);
      setCreating(false);
      setEditingTask(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setCreating(true);
    setNewTask({
      name: task.name,
      description: task.description,
      completed: task.completed,
      priority: task.priority,
      tags: task.tags.map((t) => ({ tagName: t.tagName })),
    });
  };

  const handleSaveTask = async () => {
    if (!newTask.name) {
      setError("Task name is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let saved: Task;

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
        };

        saved = await updateTask(editingTask.id!, mergedTask);

        setTasks(tasks?.map((t) => (t.id === saved.id ? saved : t)) ?? []);
        setEditingTask(null);
      } else {
        saved = await createTask(newTask);
        setTasks([saved, ...(tasks ?? [])]);
      }

      setCreating(false);
      setEditingTask(null);

      setNewTask({
        name: "",
        description: "",
        completed: false,
        priority: "LOW",
        tags: [],
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await completeTask(id);

      setTasks(
        (prev) =>
          prev?.map((t) => (t.id === id ? { ...t, completed: true } : t)) ?? []
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveTaskToTrash = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await moveTaskToTrash(id);

      setTasks((prev) => prev?.filter((t) => t.id !== id) ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMoveCompletedToTrash = async () => {
    setLoading(true);
    setError(null);

    try {
      await moveCompletedTasksToTrash();

      setTasks((prev) => prev?.filter((t) => !t.completed) ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" m-0 p-5 flex flex-col items-center space-y-4">
      <h1 className=" font-bold text-3xl text-[#453688]">Your tasks</h1>
      {!creating && (
        <>
          {/* Top buttons */}
          <div className="flex flex-row space-x-3">
            <button
              className="px-4 py-2 rounded bg-[#BFDBF7] border border-transparent hover:border-[#646cff]"
              onClick={() => {
                setCreating(true);
                setEditingTask(null);
                setNewTask({
                  name: "",
                  description: "",
                  completed: false,
                  priority: "LOW",
                  tags: [],
                });
              }}
            >
              + Register New Task
            </button>

            <button
              className="px-4 py-2 bg-[#BFDBF7] rounded hover:border-[#646cff]"
              onClick={handleMoveCompletedToTrash}
            >
              Move Completed to Trash
            </button>
          </div>

          {/* Search */}
          <div className="mt-5 flex flex-col items-center space-y-3 w-1/2">
            <div className="flex flex-row items-center gap-4">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="name"
                  checked={searchMode === "name"}
                  onChange={() => setSearchMode("name")}
                />
                Search by Name
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  value="tag"
                  checked={searchMode === "tag"}
                  onChange={() => setSearchMode("tag")}
                />
                Search by Tag
              </label>
            </div>
            <div className="flex flex-row gap-2 mt-2">
              <input
                type="text"
                placeholder={`Enter ${searchMode}`}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="px-2 py-1 border rounded w-64"
              />
              <button
                className="px-4 py-2 bg-[#BFDBF7] rounded hover:border-[#646cff]"
                onClick={() =>
                  handleClick(
                    searchMode === "name"
                      ? () => getTaskByName(searchValue)
                      : () => getTaskByTag(searchValue)
                  )
                }
              >
                Search
              </button>
            </div>
          </div>

          {/* Filter */}
          <div className="mt-5 flex flex-row items-center gap-2">
            <span className="font-semibold mr-2">Filter tasks:</span>
            {Object.entries(fetcher).map(([label, f]) => (
              <button
                key={label}
                className="px-3 py-1 bg-[#BFDBF7] rounded hover:border-[#646cff]"
                onClick={() => handleClick(f)}
              >
                {label}
              </button>
            ))}
          </div>

          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">Error: {error}</div>}

          {tasks && (
            <div className="mt-5 font-serif">
              <div className="flex flex-wrap gap-5 justify-evenly items-start w-full">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="w-[300px] p-3 font-serif border border-gray-300 rounded-[30px] text-[#034780] bg-[#FFF9BF] bg-opacity-80"
                  >
                    <p>
                      <strong>Name:</strong> {task.name}
                    </p>

                    {task.description && (
                      <p>
                        <strong>Description:</strong> {task.description}
                      </p>
                    )}

                    <p>
                      <strong>Priority:</strong> {task.priority}
                    </p>

                    {task.tags.length > 0 && (
                      <p>
                        <strong>Tags:</strong>{" "}
                        {task.tags.map((t) => t.tagName).join(", ")}
                      </p>
                    )}

                    <div className="mt-2 flex gap-2">
                      <button
                        className="px-3 py-1 bg-[#FFB2E6] rounded-[30px] hover:bg-yellow-600"
                        onClick={() => handleEditClick(task)}
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className="px-3 py-1 bg-[#FFB2E6] rounded-[30px] hover:bg-red-500"
                        onClick={() => handleMoveTaskToTrash(task.id!)}
                      >
                        🗑️ Trash
                      </button>

                      <button
                        className="px-3 py-1 bg-[#FFB2E6] rounded-[30px] hover:bg-green-500"
                        onClick={() => handleCompleteTask(task.id!)}
                      >
                        ✅ Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {creating && (
        <div className=" p-4 rounded flex flex-col items-center gap-3">
          <h2 className="mb-2 font-bold">
            {editingTask ? "Edit Task" : "Create New Task"}
          </h2>

          <div className="flex flex-row items-center justify-center gap-2">
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
              className="mb-2 px-2 py-1 border rounded w-64 "
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
          </div>

          {/* Buttons */}
          <div className="flex flex-row justify-center gap-2 mt-2">
            <button
              className="px-4 py-2 bg-[#BFDBF7] rounded hover:bg-green-600"
              onClick={handleSaveTask}
              disabled={loading}
            >
              Save Task
            </button>

            <button
              className="px-4 py-2 bg-[#6196B7] rounded hover:bg-gray-400"
              onClick={() => {
                setCreating(false);
                setEditingTask(null);
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
  );
}
