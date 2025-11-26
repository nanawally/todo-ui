export interface Tag {
  id: string;
  tagName: string;
  taskType: "ACTIVE" | "DELETED";
}
