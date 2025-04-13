<script setup>
    import { ref } from 'vue';

    const { auth } = useSupabaseClient();
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
            const { error } = await auth.signInWithPassword({
                email: form.value.email,
                password: form.value.password
            });
            if (error) {
                console.log(error)
            }else{
                navigateTo('/', )
            }
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

        <Form @submit.prevent="loginUser">
        <div class="mb-4">
            <InputText v-model="form.email" type="email" placeholder="電子郵件" required class="w-full px-4 py-2"/>
        </div>

        <div class="mb-4">
            <label class="block text-gray-700">密碼</label>
            <InputText v-model="form.password" type="password" required class="w-full px-4 py-2"/>
        </div>

        <Button type="submit" :disabled="loading"  class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50">
            {{ loading ? '登入中...' : '登入' }}
        </Button>
        </Form>

        <p class="mt-4 text-center text-gray-600">
        還沒有帳號？ 
        <NuxtLink to="/register" class="text-blue-600 hover:underline">立即註冊</NuxtLink>
        </p>
    </div>
    <InputText name="username" type="text" placeholder="Username" />
    </div>
</template>

<style>
/* 可選的全局樣式 */
</style>
