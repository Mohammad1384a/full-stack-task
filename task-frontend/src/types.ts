export type TaskStatus = "todo" | "in_progress" | "done" | "blocked";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  startDate: string; // ISO
  endDate: string; // ISO
  status: TaskStatus;
  assignee: User;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  assigneeId: string;
  status: TaskStatus;
}
