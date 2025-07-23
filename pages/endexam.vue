<script setup lang="ts">
import { useRouter } from 'vue-router'

const scoreStore = useScoreStore()
const userStore = useUserStore()
const supabase = useSupabaseClient()
const router = useRouter()

// const mouseX = ref(0)
// const mouseY = ref(0)

const scores = scoreStore.score

const colorMode = useColorMode()
const isLight = ref(false)
onMounted(() => {
  isLight.value = (colorMode.value === 'light')
})

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

// 功能卡片動畫
const examCardHover = ref(false)
const scoreCardHover = ref(false)

const totalScore = ref(scores.partA+scores.partB+scores.partC)

const getDate = () => {
  const today = new Date()
  const yy = today.getFullYear()
  const mm = String(today.getMonth()+1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${yy}-${mm}-${dd}`
}

const endexam = async() => {
  const date = await getDate()
  const { error } = await supabase.from('scores').insert({scores_score: totalScore.value, scores_date: date, users_id: userStore.user?.users_id })
}

onMounted(() => {
  endexam()
})
</script>

<template>
  <div class="relative min-h-screen min-w-screen overflow-hidden font-sans">
    <!-- 自訂滑鼠游標 -->
    <!-- <div 
      class="absolute rounded-full w-12 h-12 bg-gray-400/60 shadow-[0_0_15px_15px_rgba(114,105,105,0.6)] pointer-events-none z-[9999]" 
      :style="{ left: `${mouseX}px`, top: `${mouseY}px` }" 
    /> -->

    <div class="flex flex-col h-full">
      <div class="flex-1 bg-gradient-to-b from-[#d6e2ef] to-[#9ccafb] p-8 min-w-screen min-h-screen">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">BigByte English Proficiency Test</h1>
          <p class="text-gray-600 text-2xl">分數結算<br>Score Calculation</p>
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
                  <p class="mb-6 text-6xl" :class="[isLight ? 'text-blue-300' : 'text-blue-100']">{{ totalScore }}/90</p>
                  <h2 class="text-xl font-bold mb-2">總成績<br>Total Score</h2>
                </div>
              </template>
            </Card>
        </div>
        
        <div class="flex min-w-full items-center justify-center mt-10">
            <Button label="Finish Test" @click="router.push('/main')">
            </Button>
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