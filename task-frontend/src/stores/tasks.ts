import { defineStore } from "pinia";
import http from "../api/http";
import type { Task, CreateTaskPayload, TaskStatus } from "../types";

export const useTasksStore = defineStore("tasks", {
  state: () => ({
    items: [] as Task[],
    q: "",
    status: "" as "" | TaskStatus,
    assigneeId: "" as string | "",
  }),
  getters: {
    filtered(state) {
      return state.items.filter(
        (t) =>
          (!state.status || t.status === state.status) &&
          (!state.assigneeId || t.assignee.id === state.assigneeId)
      );
    },
  },
  actions: {
    async load() {
      const query = this.q ? `?q=${encodeURIComponent(this.q)}` : "";
      const { data } = await http.get<Task[]>(`/tasks${query}`);
      this.items = data;
    },
    async create(payload: CreateTaskPayload) {
      const { data } = await http.post<Task>("/tasks", payload);
      this.items.unshift(data);
    },
    async update(
      id: string,
      patch: Partial<CreateTaskPayload & { newAssigneeId: string }>
    ) {
      const { data } = await http.put<Task>(`/tasks/${id}`, patch);
      const idx = this.items.findIndex((t) => t.id === id);
      if (idx >= 0) this.items[idx] = data;
    },
    async remove(id: string) {
      await http.delete(`/tasks/${id}`);
      this.items = this.items.filter((t) => t.id !== id);
    },
  },
});
