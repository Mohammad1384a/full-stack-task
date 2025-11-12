import { createRouter, createWebHistory } from "vue-router";
import LoginView from "./views/LoginView.vue";
import TasksView from "./views/TasksView.vue";
import { useAuthStore } from "./stores/auth";
import CreateUserView from "./views/CreateUserView.vue";
import MyTasksView from "./views/MyTasksView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/login", component: LoginView },
    { path: "/", redirect: "/tasks" },
    { path: "/tasks", component: TasksView, meta: { auth: true } },
    { path: "/my", component: MyTasksView, meta: { auth: true } },
    {
      path: "/admin/users/create",
      component: CreateUserView,
      meta: { auth: true, roles: ["admin"] },
    },
  ],
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  // need login?
  if (to.meta?.auth && !auth.token) return "/login";

  // ensure user is loaded if we have a token
  if (auth.token && !auth.user) {
    try {
      await auth.refreshMe();
    } catch {
      return "/login";
    }
  }

  // role check
  const roles = (to.meta?.roles as string[] | undefined) || [];
  if (roles.length && (!auth.user || !roles.includes(auth.user.role))) {
    // not authorized -> send to tasks or login
    return auth.user ? "/tasks" : "/login";
  }
});

export default router;
