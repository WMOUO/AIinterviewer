<script setup lang="ts">
import { useRouter } from 'vue-router'

const scoreStore = useScoreStore()
const router = useRouter()

const mouseX = ref(0)
const mouseY = ref(0)

const scores = scoreStore.score

const updateCursor = (e: MouseEvent) => {
  mouseX.value = e.clientX - 20
  mouseY.value = e.clientY - 20
}

onMounted(() => {
  window.addEventListener("mousemove", updateCursor)
  
  // 測驗系統結束就可以實際抓資料
  scoreStore.setScore('partA', 30)
  scoreStore.setScore('partB', 25)
  scoreStore.setScore('partC', 22)
})

onUnmounted(() => {
  window.removeEventListener("mousemove", updateCursor)
})

// 功能卡片動畫
const examCardHover = ref(false)
const scoreCardHover = ref(false)

</script>

<template>
  <div class="relative min-h-screen min-w-screen overflow-hidden font-sans">
    <!-- 自訂滑鼠游標 -->
    <div 
      class="absolute rounded-full w-12 h-12 bg-gray-400/60 shadow-[0_0_15px_15px_rgba(114,105,105,0.6)] pointer-events-none z-[9999]" 
      :style="{ left: `${mouseX}px`, top: `${mouseY}px` }" 
    />

    <div class="flex flex-col h-full">
      <div class="flex-1 bg-gradient-to-b from-[#d6e2ef] to-[#9ccafb] p-8 min-w-screen min-h-screen">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">AI 英語語音測驗系統</h1>
          <p class="text-gray-600 text-2xl">分數結算</p>
        </div>

        <div class="max-w-4xl mx-auto mb-8">
          <Card class="bg-white/80 backdrop-blur">
            <template #content>
              <div class="grid grid-cols-3 gap-4 text-center">
                <div class="p-4">
                  <p class="text-3xl font-bold" :class=" scores.partA===30 ? 'text-blue-600' : 'text-green-600'">{{ scores.partA }}/30</p>
                  <p class="text-sm text-gray-600 mt-1">partA</p>
                </div>
                <div class="p-4 border-x border-gray-200">
                  <p class="text-3xl font-bold" :class=" scores.partB===30 ? 'text-blue-600' : 'text-green-600'">{{ scores.partB }}/30</p>
                  <p class="text-sm text-gray-600 mt-1">partB</p>
                </div>
                <div class="p-4">
                  <p class="text-3xl font-bold" :class=" scores.partC===30 ? 'text-blue-600' : 'text-green-600'">{{ scores.partC }}/30</p>
                  <p class="text-sm text-gray-600 mt-1">partC</p>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-4xl mx-auto">
            <Card class="min-h-full text-white shadow-xl">
              <template #content>
                <div class="flex flex-col items-center justify-center text-center py-12 min-h-full">
                  <p class="text-blue-100 mb-6 text-6xl">68/90</p>
                  <h2 class="text-xl font-bold mb-2">總成績</h2>
                </div>
              </template>
            </Card>
        </div>
        
        <div class="flex min-w-full items-center justify-center mt-10">
            <Button label="結束測驗" @click="router.push('/main')"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>