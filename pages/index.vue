<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const mouseX = ref(0)
const mouseY = ref(0)

const updateCursor = (e: MouseEvent) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
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

const check = () => {
  if (examCode.value === '123456') {
    showInput.value = false
    router.push('/main')
  } else {
    alert('考試碼錯誤，請重新輸入')
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
        <div class="space-x-4">
          <Button label="Log in" severity="secondary" @click="showInput = true" />
          <Button label="Sign in" severity="primary" @click="toggleModal" />
        </div>
      </div>

      <!-- 中層 -->
      <div class="flex flex-1 h-[60%] bg-[#d6e2ef] items-center justify-around px-6">
        <img src="~/assets/images/interview.jpg" alt="aiinterview" class="w-[300px] rounded shadow" />
        <p class="text-center max-w-lg text-black">
          Because the website looks too empty, I put some irrelevant text in it.
          <br><br>
          Anyway, this is a website for online interviews. It uses artificial intelligence to conduct interviews.
        </p>
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
