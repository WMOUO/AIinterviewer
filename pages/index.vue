<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { User } from '~/stores/user'
const userStore = useUserStore()
const toast = useToast()
const router = useRouter()

const mouseX = ref(0)
const mouseY = ref(0)

const updateCursor = (e: MouseEvent) => {
  mouseX.value = e.clientX-20
  mouseY.value = e.clientY-20
}

onMounted(() => {
  window.addEventListener("mousemove", updateCursor)
})

onUnmounted(() => {
  window.removeEventListener("mousemove", updateCursor)
})

const showInput = ref(false)
const examCode = ref('')
const toggleModal = () => {
  alert('尚未實作註冊功能')
}

const check = async() => {
  showInput.value = false
  const { data,error } = await useFetch('/api/login', {
    method: 'POST',
    body: { userId: examCode.value }
  })

  if (data.value) {
    userStore.setUser(data.value.data.user as User)
    router.push('/main')
    toast.add({
      severity: 'success',
      summary: '登入成功',
      group: 'login',
      life: 3000
    })
  } else {
    toast.add({
      severity: 'error',
      summary: '登入失敗',
      group: 'login',
      life: 3000
    })
  } 
}
</script>

<template>
  <div class="relative h-screen w-screen overflow-hidden font-sans">
    <!-- 自訂滑鼠游標 -->
    <div class="absolute rounded-full w-12 h-12 bg-gray-400/60 shadow-[0_0_15px_15px_rgba(114,105,105,0.6)] pointer-events-none z-[9999]" :style="{ left: `${mouseX}px`, top: `${mouseY}px` }" />

    <!-- 主內容 -->
    <div class="flex flex-col h-full">
      
      <!-- 上層 -->
      <div class="flex justify-between items-center h-[30%] bg-[#d6e2ef] p-6">
        <img src="~/assets/images/titletext.png" alt="titletext" class="max-h-full max-w-[60%]" />
      </div>

      <!-- 中層 -->
      <div class="flex flex-1 h-[60%] bg-[#d6e2ef] items-center justify-around px-6">
        <img src="~/assets/images/interview.jpg" alt="aiinterview" class="w-[300px] rounded shadow" />
        <div class="flex flex-col gap-6">
          <p class="text-center max-w-lg text-black">
            Because the website looks too empty, I put some irrelevant text in it.
            <br><br>
            Anyway, this is a website for online interviews. It uses artificial intelligence to conduct interviews.
          </p>
           <Button label="進入系統" severity="secondary" @click="showInput = true" class="w-auto self-center"/>
        </div>
      </div>

      <!-- 下層 -->
      <div class="h-[10%] bg-[#9ccafb] flex items-center justify-center">
        <img src="~/assets/images/down.png" alt="titletext" class="h-full object-contain" />
      </div>
    </div>

    <!-- 彈出輸入框 -->
    <Dialog v-model:visible="showInput" header="請輸入考試碼" modal>
      <div class="flex flex-col gap-4">
        <InputText v-model="examCode" placeholder="考試碼（如：123456）" />
        <Button label="確認" @click="check" />
      </div>
    </Dialog>
  </div>
</template>
