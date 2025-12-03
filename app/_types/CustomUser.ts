import { UserRole } from "./UserRole";

export interface CustomUser {
  id: string;
  username: string;
  password: string;
  isAccountNonExpired: boolean;
  isAccountNonLocked: boolean;
  isCredentialsNonExpired: boolean;
  isEnabled: boolean;
  roles: UserRole[];
}
