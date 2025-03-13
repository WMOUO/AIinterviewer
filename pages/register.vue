<script setup>
    import { ref } from 'vue';

    const form = ref({
        username: '',
        password: '',
        email: '',
        birthday: ''
    });

    const registerUser = async () => {
        try {
            const response = await $fetch('/api/user/register', {
                method: 'POST',
                body: form.value
            });
            console.log(response);
        } catch (error) {
            console.error('註冊失敗', error);
        }
    };
</script>

<template>
  <div>
    <input v-model="form.username" placeholder="使用者名稱">
    <input v-model="form.password" type="password" placeholder="密碼">
    <input v-model="form.email" type="email" placeholder="信箱">
    <input v-model="form.birthday" type="date" placeholder="生日">
    <button @click="registerUser">註冊</button>
  </div>
</template>
