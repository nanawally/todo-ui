import { TagDTO } from "./TagDTO";

export interface TaskDTO {
  name: string;
  description?: string | null;
  completed: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH";
  tags: TagDTO[];
}
