"use client";

import { CustomUser } from "@/app/_types/CustomUser";
import { UserRole } from "@/app/_types/UserRole";
import { useEffect, useState } from "react";
import {
  getAllUsers,
  registerNewUser,
  deleteUserById,
} from "@/app/_service/adminservice";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/app/_hooks/useRequireAuth";

export default function Page() {
  const checkingAuth = useRequireAuth("http://localhost:8080/admin/users");
  const [users, setUsers] = useState<CustomUser[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    isAccountNonExpired: true,
    isAccountNonLocked: true,
    isCredentialsNonExpired: true,
    isEnabled: true,
    roles: [] as UserRole[],
  });

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (checkingAuth === false) {
      const fetchUsers = async () => {
        try {
          const data = await getAllUsers();
          setUsers(data);
        } catch (err: any) {
          setError(err.message);
        }
      };

      fetchUsers();
    }
  }, [checkingAuth]);

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      const created = await registerNewUser(newUser as CustomUser);
      setUsers((prev) => (prev ? [...prev, created] : [created]));
      // Reset form
      setNewUser({
        username: "",
        password: "",
        isAccountNonExpired: true,
        isAccountNonLocked: true,
        isCredentialsNonExpired: true,
        isEnabled: true,
        roles: [],
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a user
  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteUserById(id);
      setUsers((prev) => prev?.filter((u) => u.id !== id) ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth !== false) return null;
  if (loading) return <p>Loading...</p>;

  return (
    <div className="m-0 p-5 flex flex-col items-center space-y-4">
      <h1 className="font-bold text-3xl text-[#453688]">Admin Users</h1>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}

      {/* Register New User */}
      <div className="mb-4 p-4 border rounded space-y-2 w-[350px]">
        <h2 className="font-semibold text-xl">Register New User</h2>
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, username: e.target.value }))
          }
          className="px-2 py-1 border rounded w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, password: e.target.value }))
          }
          className="px-2 py-1 border rounded w-full"
        />

        <div className="flex flex-row space-x-2 mt-1">
          <label className="flex items-center space-x-1">
            <input
              type="checkbox"
              checked={newUser.roles.includes("USER")}
              onChange={(e) =>
                setNewUser((prev) => {
                  const roles = prev.roles.includes("USER")
                    ? prev.roles.filter((r) => r !== "USER")
                    : [...prev.roles, "USER"];
                  return { ...prev, roles };
                })
              }
            />
            <span>USER</span>
          </label>
          <label className="flex items-center space-x-1">
            <input
              type="checkbox"
              checked={newUser.roles.includes("ADMIN")}
              onChange={(e) =>
                setNewUser((prev) => {
                  const roles = prev.roles.includes("ADMIN")
                    ? prev.roles.filter((r) => r !== "ADMIN")
                    : [...prev.roles, "ADMIN"];
                  return { ...prev, roles };
                })
              }
            />
            <span>ADMIN</span>
          </label>
        </div>

        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mt-2"
          onClick={handleRegister}
        >
          Register
        </button>
      </div>

      {/* Users List */}
      {users && (
        <div className="mt-5 font-serif">
          <div className="flex flex-wrap gap-5 justify-evenly items-start w-full">
            {users.map((user) => (
              <div
                key={user.id}
                className="w-[300px] p-3 font-serif border border-gray-300 
                     rounded-[30px] text-[#034780] bg-[#FFF9BF] bg-opacity-80"
              >
                <p>
                  <strong>Username:</strong> {user.username}
                </p>
                <p>
                  <strong>Roles:</strong> {user.roles.join(", ")}
                </p>
                <p>
                  <strong>Enabled:</strong> {user.isEnabled ? "Yes" : "No"}
                </p>

                <div className="mt-2 flex gap-2">
                  <button
                    className="px-3 py-1 text-white rounded-[30px] bg-[#FFB2E6] hover:bg-red-500 "
                    onClick={() => handleDelete(user.id)}
                  >
                    🗑️ Delete
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
