<script setup lang="ts">
import { onMounted } from "vue";
import { useTasksStore } from "../stores/tasks";
const tasks = useTasksStore();
onMounted(() => tasks.load()); // backend returns only my tasks for non-admin anyway
</script>

<template>
  <div style="max-width: 1100px; margin: 24px auto">
    <h2>My Tasks</h2>
    <!-- reuse TaskBoard -->
    <TaskBoard />
  </div>
</template>
