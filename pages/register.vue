<script setup>
    import { ref } from 'vue';

    const form = ref({
        username: '',
        password: '',
        email: '',
    });

    const registerUser = async () => {
        try {
            const response = await $fetch('/api/user/register', {
                method: 'POST',
                body: form.value
            });
            console.log(response);
            if (response.message === "註冊成功") {
                navigateTo("/login")
            }
        } catch (error) {
            console.error('註冊失敗', error);
        }
    };
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg">
            <h2 class="text-2xl font-semibold text-center text-gray-700 mb-4">註冊帳號</h2>
            <div class="space-y-4">
                <InputText v-model:value="form.username" type="text" placeholder="使用者名稱" round size="Large"/>
                <InputText v-model:value="form.email" type="email" placeholder="信箱" round size="Large"/>
                <InputText v-model:value="form.password" type="password" placeholder="密碼" show-password-on="click" round size="Large"/>
                <Button class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-all" @click="registerUser">註冊</Button>
            </div>
        </div>
    </div>
</template>
