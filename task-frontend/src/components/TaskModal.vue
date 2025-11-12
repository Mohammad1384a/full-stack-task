<script setup lang="ts">
import { computed, reactive, watch } from "vue";
import { useUsersStore } from "../stores/users";
import { useTasksStore } from "../stores/tasks";
import type { Task, TaskStatus, CreateTaskPayload } from "../types";
import { formatISO } from "date-fns";
import { ElMessage } from "element-plus";

const props = defineProps<{ open: boolean; task?: Task | null }>();
const emit = defineEmits<{ (e: "close"): void }>();
const usersStore = useUsersStore();
const tasksStore = useTasksStore();

const form = reactive<CreateTaskPayload>({
  title: "",
  description: "",
  startDate: formatISO(new Date()),
  endDate: formatISO(new Date()),
  assigneeId: "",
  status: "todo",
});

watch(
  () => props.task,
  (t) => {
    if (t) {
      form.title = t.title;
      form.description = t.description ?? "";
      form.startDate = t.startDate;
      form.endDate = t.endDate;
      form.assigneeId = t.assignee.id;
      form.status = t.status;
    } else {
      form.title = "";
      form.description = "";
      form.assigneeId = usersStore.items[0]?.id || "";
      form.status = "todo";
    }
  },
  { immediate: true }
);

const isEdit = computed(() => !!props.task);

async function save() {
  try {
    if (!form.title || !form.assigneeId) throw new Error("Missing fields");
    if (isEdit.value) {
      await tasksStore.update(props.task!.id, form);
    } else {
      await tasksStore.create(form);
    }
    emit("close");
  } catch (e: any) {
    // backend returns 400 on overlap; show it plainly
    ElMessage.error(e?.response?.data?.message || e?.message || "Failed");
  }
}
</script>

<template>
  <el-dialog
    :model-value="open"
    title="Task"
    width="600px"
    @close="$emit('close')"
  >
    <el-form label-width="120">
      <el-form-item label="Title"
        ><el-input v-model="form.title"
      /></el-form-item>
      <el-form-item label="Description"
        ><el-input type="textarea" v-model="form.description"
      /></el-form-item>
      <el-form-item label="Start"
        ><el-date-picker v-model="form.startDate" type="datetime"
      /></el-form-item>
      <el-form-item label="End"
        ><el-date-picker v-model="form.endDate" type="datetime"
      /></el-form-item>
      <el-form-item label="Assignee">
        <el-select v-model="form.assigneeId">
          <el-option
            v-for="u in usersStore.items"
            :key="u.id"
            :label="u.name"
            :value="u.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="Status">
        <el-select v-model="form.status">
          <el-option label="To do" value="todo" />
          <el-option label="In progress" value="in_progress" />
          <el-option label="Done" value="done" />
          <el-option label="Blocked" value="blocked" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="$emit('close')">Cancel</el-button>
      <el-button type="primary" @click="save">{{
        isEdit ? "Save" : "Create"
      }}</el-button>
    </template>
  </el-dialog>
</template>
