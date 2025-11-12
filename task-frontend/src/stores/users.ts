import { defineStore } from "pinia";
import http from "../api/http";
import type { User } from "../types";

export const useUsersStore = defineStore("users", {
  state: () => ({ items: [] as User[], loaded: false }),
  actions: {
    async fetchAll() {
      const { data } = await http.get<User[]>("/users");
      this.items = data;
      this.loaded = true;
    },
  },
});
