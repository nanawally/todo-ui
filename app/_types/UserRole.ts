// User roles as seen by the frontend
export type UserRole = "GUEST" | "USER" | "ADMIN"

// Optionally, include the role names used in Spring Security if needed
export const UserRoleName = {
  GUEST: "ROLE_GUEST" as const,
  USER: "ROLE_USER" as const,
  ADMIN: "ROLE_ADMIN" as const,
}
