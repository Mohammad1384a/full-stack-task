<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { ElMessage } from "element-plus";

const form = reactive({ email: "admin@example.com", password: "admin123" });
const loading = reactive({ v: false });
const auth = useAuthStore();
const router = useRouter();

async function submit() {
  try {
    loading.v = true;
    await auth.login(form.email, form.password);
    router.push("/tasks");
  } catch (e: any) {
    ElMessage.error(e?.message || "Login failed");
  } finally {
    loading.v = false;
  }
}
</script>

<template>
  <div class="login" style="max-width: 360px; margin: 80px auto">
    <h2>Login</h2>
    <el-form @submit.prevent="submit">
      <el-form-item label="Email"
        ><el-input v-model="form.email"
      /></el-form-item>
      <el-form-item label="Password"
        ><el-input v-model="form.password" type="password"
      /></el-form-item>
      <el-button type="primary" :loading="loading.v" @click="submit"
        >Login</el-button
      >
    </el-form>
  </div>
</template>
