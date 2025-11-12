<script setup lang="ts">
import { reactive } from "vue";
import { ElMessage } from "element-plus";
import http from "../api/http";
import { useAuthStore } from "../stores/auth";
const auth = useAuthStore();

const form = reactive({
  name: "",
  email: "",
  password: "",
  role: "user" as "admin" | "user",
});

async function submit() {
  try {
    if (!auth.isAdmin) {
      ElMessage.error("Not allowed");
      return;
    }
    await http.post("/users", form);
    ElMessage.success("User created");
    form.name = form.email = form.password = "";
    form.role = "user";
  } catch (e: any) {
    ElMessage.error(e?.response?.data?.message || "Failed to create user");
  }
}
</script>

<template>
  <div style="max-width: 480px; margin: 24px auto">
    <h2>Create User</h2>
    <el-form label-width="120px" @submit.prevent="submit">
      <el-form-item label="Name"><el-input v-model="form.name" /></el-form-item>
      <el-form-item label="Email"
        ><el-input v-model="form.email"
      /></el-form-item>
      <el-form-item label="Password"
        ><el-input type="password" v-model="form.password"
      /></el-form-item>
      <el-form-item label="Role">
        <el-select v-model="form.role" style="width: 160px">
          <el-option label="User" value="user" />
          <el-option label="Admin" value="admin" />
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="submit">Create</el-button>
    </el-form>
  </div>
</template>
