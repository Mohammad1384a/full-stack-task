import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import { useAuthStore } from "./stores/auth";

const app = createApp(App).use(createPinia()).use(router).use(ElementPlus);
app.mount("#app");

const auth = useAuthStore();
if (auth.token) auth.refreshMe(); // load user/role on reload
