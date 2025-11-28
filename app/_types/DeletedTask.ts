import { Tag } from "./Tag";

export interface DeletedTask {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  completed: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH";
  tags: Tag[];
}
