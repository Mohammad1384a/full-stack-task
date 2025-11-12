<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useTasksStore } from "../stores/tasks";
import { useUsersStore } from "../stores/users";
import TaskModal from "./TaskModal.vue";
import { useAuthStore } from "../stores/auth";

const tasks = useTasksStore();
const users = useUsersStore();
const auth = useAuthStore();

const modalOpen = ref(false);
const editing = ref(null as any);

onMounted(async () => {
  if (!users.loaded) await users.fetchAll();
  await tasks.load();
});

function openCreate() {
  editing.value = null;
  modalOpen.value = true;
}
function openEdit(t: any) {
  editing.value = t;
  modalOpen.value = true;
}
</script>

<template>
  <div>
    <div
      style="display: flex; gap: 8px; align-items: center; margin-bottom: 12px"
    >
      <el-input
        v-model="tasks.q"
        placeholder="Search title/description"
        style="max-width: 240px"
        @keyup.enter="tasks.load()"
      />
      <el-select
        v-model="tasks.status"
        placeholder="Status"
        clearable
        style="width: 160px"
        @change="tasks.load()"
      >
        <el-option label="To do" value="todo" />
        <el-option label="In progress" value="in_progress" />
        <el-option label="Done" value="done" />
        <el-option label="Blocked" value="blocked" />
      </el-select>
      <el-select
        v-model="tasks.assigneeId"
        placeholder="Assignee"
        clearable
        style="width: 200px"
        @change="/* local filter only */ 0"
      >
        <el-option
          v-for="u in users.items"
          :key="u.id"
          :label="u.name"
          :value="u.id"
        />
      </el-select>
      <el-button type="primary" @click="tasks.load()">Search</el-button>
      <el-button @click="openCreate">New Task</el-button>
      <router-link v-if="auth.isAdmin" to="/admin/users/create">
        <el-button type="success">Create User</el-button>
      </router-link>
    </div>

    <el-table :data="tasks.filtered" style="width: 100%">
      <el-table-column prop="title" label="Title" />
      <el-table-column prop="assignee.name" label="Assignee" />
      <el-table-column prop="status" label="Status" />
      <el-table-column prop="startDate" label="Start" />
      <el-table-column prop="endDate" label="End" />
      <el-table-column label="Actions" width="180">
        <template #default="scope">
          <el-button size="small" @click="openEdit(scope.row)">Edit</el-button>
          <el-button
            size="small"
            type="danger"
            @click="$store = tasks.remove(scope.row.id)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <TaskModal :open="modalOpen" :task="editing" @close="modalOpen = false" />
  </div>
</template>
