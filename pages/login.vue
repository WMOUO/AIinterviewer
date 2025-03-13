<script setup>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    // 用來儲存使用者輸入的 Email 和 密碼
    const form = ref({
    email: '',
    password: ''
    });

    // 登入狀態
    const loginStatus = ref(null);
    const loading = ref(false);

    // 登入函式
    const loginUser = async () => {
        loginStatus.value = null;
        loading.value = true;
        try {
            const response = await $fetch('/api/user/login', {
                method: 'POST',
                body: form.value
            });
            if (response.success) {
                loginStatus.value = { type: 'success', message: '登入成功！' };
                router.push('/');
            } else {
                loginStatus.value = { type: 'error', message: response.message };
            }
        } catch (error) {
            console.error(error);
            loginStatus.value = { type: 'error', message: '伺服器錯誤，請稍後再試' };
        } finally {
            loading.value = false;
        }
    };
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">登入</h2>

        <div v-if="loginStatus" :class="loginStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="p-3 rounded-md text-center mb-4">
        {{ loginStatus.message }}
        </div>

        <form @submit.prevent="loginUser">
        <div class="mb-4">
            <label class="block text-gray-700">電子郵件</label>
            <input v-model="form.email" type="email" required class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>

        <div class="mb-4">
            <label class="block text-gray-700">密碼</label>
            <input v-model="form.password" type="password" required >
        </div>

        <button type="submit" :disabled="loading"  class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50">
            {{ loading ? '登入中...' : '登入' }}
        </button>
        </form>

        <p class="mt-4 text-center text-gray-600">
        還沒有帳號？ 
        <NuxtLink to="/register" class="text-blue-600 hover:underline">立即註冊</NuxtLink>
        </p>
    </div>
    </div>
</template>

<style>
/* 可選的全局樣式 */
</style>
