export type UserRole = "GUEST" | "USER" | "ADMIN";

export const UserRoleName = {
  GUEST: "GUEST" as const,
  USER: "USER" as const,
  ADMIN: "ADMIN" as const,
};
