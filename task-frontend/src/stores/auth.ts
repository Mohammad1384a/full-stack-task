import { defineStore } from "pinia";
import http from "../api/http";

type User = { id: string; name: string; email: string; role: "admin" | "user" };

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    user: null as User | null,
  }),
  getters: {
    isAdmin: (s) => s.user?.role === "admin",
    userId: (s) => s.user?.id || "",
  },
  actions: {
    async login(email: string, password: string) {
      const { data } = await http.post("/users/login", { email, password });
      if (!data?.ok || !data?.token) throw new Error("Invalid credentials");
      this.token = data.token;
      localStorage.setItem("token", data.token);
      // fetch current user profile
      const me = await http.get<User>("/users/me");
      this.user = me.data;
    },
    logout() {
      this.token = "";
      this.user = null;
      localStorage.removeItem("token");
    },
    async refreshMe() {
      if (!this.token) return;
      const me = await http.get<User>("/users/me");
      this.user = me.data;
    },
  },
});
