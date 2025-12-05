export type UserRole = "ROLE_GUEST" | "ROLE_USER" | "ROLE_ADMIN";

export const UserRoleName = {
  GUEST: "ROLE_GUEST" as const,
  USER: "ROLE_USER" as const,
  ADMIN: "ROLE_ADMIN" as const,
};
