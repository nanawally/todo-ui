import { Tag } from "./Tag";

export interface Task {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  completed: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH";
  tags: Tag[];
}
