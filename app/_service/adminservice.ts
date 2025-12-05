import { CustomUser } from "../_types/CustomUser";

const BASE_URL = "https://auth-microservice-mcep.onrender.com/admin";

export async function getAllUsers() {
  const res = await fetch(`${BASE_URL}/users`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }
  
  return res.json();
}

export async function registerNewUser(user: CustomUser) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    throw new Error(`Failed to register user: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function deleteUserById(id: string) {
  const res = await fetch(`${BASE_URL}/delete/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (res.status === 404) {
    throw new Error("User not found");
  }

  if (res.status === 204) {
    return "User successfully deleted";
  }

  if (!res.ok) {
    throw new Error("Failed to delete user");
  }
  
  return res;
}
