<script setup lang="ts">
import { onMounted } from "vue";
import { io } from "socket.io-client";
import { ElMessage } from "element-plus";
import { useAuthStore } from "../stores/auth";
import TaskBoard from "../components/TaskBoard.vue";

const auth = useAuthStore();

onMounted(() => {
  // ensure user is loaded (auth.refreshMe runs at app boot if token exists)
  if (!auth.user) return;
  const socket = io(import.meta.env.VITE_WS_URL, {
    transports: ["websocket"],
    query: { userId: auth.user.id },
  });
  socket.on("task.created", (p: any) =>
    ElMessage.success(`Task created (id: ${p.taskId})`)
  );
  socket.on("task.reassigned", (p: any) =>
    ElMessage.info(`Task reassigned (id: ${p.taskId})`)
  );
});
</script>

<template>
  <div style="max-width: 1100px; margin: 24px auto">
    <h2 style="margin-bottom: 12px">Tasks</h2>
    <TaskBoard />
  </div>
</template>
