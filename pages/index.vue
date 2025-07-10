<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { User } from '~/stores/user'

const router = useRouter()
const userStore = useUserStore()
const toast = useToast()

// const mouseX = ref(0)
// const mouseY = ref(0)
const showInput = ref(false)
const examCode = ref('')

// const updateCursor = (e: MouseEvent) => {
//   mouseX.value = e.clientX - 20
//   mouseY.value = e.clientY - 20
// }

// onMounted(() => {
//   window.addEventListener("mousemove", updateCursor)
// })
// onUnmounted(() => {
//   window.removeEventListener("mousemove", updateCursor)
// })

const check = async () => {
  showInput.value = false
  const { data, error } = await useFetch('/api/login', {
    method: 'POST',
    body: { userId: examCode.value }
  })

  if (data.value) {
    userStore.setUser(data.value.data.user as User)
    router.push('/main')
    toast.add({ severity: 'success', summary: '登入成功', group: 'login', life: 3000 })
  } else {
    toast.add({ severity: 'error', summary: '登入失敗', group: 'login', life: 3000 })
  }
}
</script>

<template>
  <div class="relative h-screen w-screen overflow-hidden font-sans bg-gradient-to-b from-[#d6e2ef] to-[#9ccafb]">
    <!-- 自訂滑鼠游標 -->
    <!-- <div
      class="absolute w-12 h-12 rounded-full bg-gray-400/60 shadow-[0_0_15px_15px_rgba(114,105,105,0.6)] pointer-events-none z-[9999]"
      :style="{ left: `${mouseX}px`, top: `${mouseY}px` }"
    /> -->

    <!-- 主內容 -->
    <div class="flex flex-col h-full">
      <!-- 頂部區塊 -->
      <!-- <div class="flex justify-between items-center h-[20%] px-6 pt-4">
        <img src="/images/titletext.png" alt="AI Interviewer" class="h-full max-h-16" />
         
      </div> -->

      <!-- 中間內容 -->
      <div class="flex-1 flex flex-col md:flex-row items-center justify-around px-8 gap-6">
        <!-- 左側圖片 -->
        <div class="flex flex-col w-full md:w-[50%] items-center gap-3">
          <p class="md:text-5xl text-4xl text-black font-caveat mb-3">
            BigByte English Proficiency Test
         </p>
          <img src="/images/interview.jpg" alt="AI Interview" class="w-[300px] rounded-xl shadow-lg" />
        </div>

        <!-- 右側說明與按鈕 -->
        <div class="flex flex-col items-center gap-4 max-w-md text-center">
          <p class="text-black leading-relaxed text-xl">
            Welcome to BigByte English Proficiency Test.<br/>
            This platform uses AI technology to help you practice your spoken English.
          </p>
          <Button label="Enter System" severity="secondary" @click="showInput = true" class="px-6 py-2 text-md" />
        </div>
      </div>

      <!-- 底部裝飾 -->
      <!-- <div class="h-[10%] flex items-center justify-center">
        <img src="/images/down.png" alt="Footer Decoration" class="h-full object-contain opacity-80" />
      </div> -->
    </div>

    <!-- 考試碼輸入對話框 -->
    <Dialog v-model:visible="showInput" header="Please enter your ID" modal class="rounded-xl">
      <template #header>
        <div>
          <p class="text-xl">請輸入您的ID</p>
          <p class="text-xs">Please enter your ID</p>
        </div>
      </template>
      <div class="flex flex-col gap-4">
        <InputText v-model="examCode" placeholder="ID（ex. 123456）" @keyup.enter="check" class="w-full" />
        <Button label="Login" @click="check" class="self-end" />
      </div>
    </Dialog>
  </div>
</template>
