<script setup lang="ts">
type UserScore = {
  scores_score: number
}

import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const confirm = useConfirm()

const supabase = useSupabaseClient()

const colorMode = useColorMode()
const isLight = ref(false)
onMounted(() => {
  isLight.value = (colorMode.value === 'light')
})

// const mouseX = ref(0)
// const mouseY = ref(0)
const userName = ref(userStore.user?.users_name)
const userId = userStore.user?.users_id

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

// 導航功能
const goToExam = () => {
  router.push('/exam') // 測驗列表頁
}

const goToScores = () => {
  router.push('/score') // 成績查詢頁
}

const logout = () => {
  confirm.require({
    message: '確定要登出嗎？',
    header: '確認登出',
    acceptLabel: '確定',
    rejectLabel: '取消',
    acceptClass: 'p-button-danger',
    accept: async() => {
      await useFetch('/api/logout', { method: 'POST' })
      userStore.clearUser()
      router.push('/')
    }
  })
}

// 今日統計資料（可以從 API 獲取
const todayStats = ref({
  completedExams: 0,
  averageScore: 0,
})

onMounted(async() => {
  const { data, error } = await supabase.from('scores').select('scores_score').eq('users_id',userId as string)
  if (error) {
    console.log(error)
  }
  todayStats.value.completedExams = data?.length as 0
  console.log(data)
  
  let allScores: number[] = (data as { scores_score: number }[] ?? []).map(i => i.scores_score)
  let totalScores = allScores.reduce((a,b) => a + b)
  todayStats.value.averageScore = totalScores/allScores.length
  }
)
</script>

<template>
  <div class="relative min-h-screen min-w-screen overflow-hidden font-sans bg-gradient-to-b from-[#d6e2ef] to-[#9ccafb]">
    <!-- 自訂滑鼠游標 -->
    <!-- <div 
      class="absolute rounded-full w-12 h-12 bg-gray-400/60 shadow-[0_0_15px_15px_rgba(114,105,105,0.6)] pointer-events-none z-[9999]" 
      :style="{ left: `${mouseX}px`, top: `${mouseY}px` }" 
    /> -->

    <!-- 主內容 -->
    <div class="flex flex-col h-full">
      
      <!-- 頂部導航列 -->
      <!-- <div class="flex justify-end items-center h-[15%] bg-[#d6e2ef] px-6 shadow-md"> -->
      <div class="absolute top-0 right-6">
        <!-- <img src="/images/titletext.png" alt="titletext" class="h-[60%]" /> -->
        <div class="flex items-center space-x-6 pt-3">
          <div class="text-right mt-0.5">
            <p class="text-sm text-gray-600">帳號名稱</p>
            <p v-if="userStore.user" class="text-xl font-semibold text-gray-800">{{ userStore.user.users_name }}</p>
          </div>
          <div class="flex items-center">
            <Button 
              label="SignOut" 
              severity="secondary" 
              size="normal"
              icon="pi pi-sign-out"
              @click="logout"
            />
          </div>
        </div>
      </div>

      <!-- 主要內容區 -->
      <div class="flex-1 p-8">
        
        <!-- 歡迎訊息 -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">BigByte English Proficiency Test</h1>
          <p class="text-gray-600">選擇您想要進行的操作<br>Select the action you want to perform</p>
        </div>

        <!-- 今日統計 -->
        <div class="max-w-4xl mx-auto mb-8">
          <Card class="bg-white/80 backdrop-blur">
            <template #header>
              <div class="px-6 pt-4">
                <h3 class="text-xl font-semibold flex items-center" :class="[isLight ? 'text-gray-700' : 'text-blue-100']">
                  <i class="pi pi-chart-line mr-2"></i>
                  學習統計/Learning Statistics
                </h3>
              </div>
            </template>
            <template #content>
              <div class="grid grid-cols-2 gap-4 text-center">
                <div class="p-4">
                  <p class="text-3xl font-bold text-blue-600">{{ todayStats.completedExams }}</p>
                  <p class="text-sm mt-1" :class="[isLight ? 'text-gray-600' : 'text-zinc-300']">完成測驗次數<br>Number of Completed Quizzes</p>
                </div>
                <div class="p-4 border-l border-gray-200">
                  <p class="text-3xl font-bold text-green-600">{{ todayStats.averageScore.toFixed(1) }}</p>
                  <p class="text-sm mt-1" :class="[isLight ? 'text-gray-600' : 'text-zinc-300']">平均分數<br>Average Score</p>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <!-- 功能按鈕區 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          <!-- 進入測驗卡片 -->
          <div 
            @mouseenter="examCardHover = true"
            @mouseleave="examCardHover = false"
            @click="goToExam"
            class="cursor-pointer transform transition-all duration-300"
            :class="{ 'scale-105': examCardHover }"
          >
            <Card class="min-h-full text-white shadow-xl">
              <template #content>
                <div class="flex flex-col items-center justify-center text-center py-12 min-h-full">
                  <div class="flex flex-col gap-0 items-center mb-2">
                    <h2 class="text-2xl font-bold">進入測驗</h2>
                    <p class="">Begin the Test</p>
                  </div>
                  <p class="mb-6" :class="[isLight ? 'text-slate-600' : 'text-zinc-300']">開始您的英語語音測驗練習<br>Start Your English Speaking Test Practice</p>
                </div>
              </template>
            </Card>
          </div>

          <!-- 成績查詢卡片 -->
          <div 
            @mouseenter="scoreCardHover = true"
            @mouseleave="scoreCardHover = false"
            @click="goToScores"
            class="cursor-pointer transform transition-all duration-300"
            :class="{ 'scale-105': scoreCardHover }"
          >
            <Card class="h-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl">
              <template #content>
                <div class="text-center py-12">
                  <div class="flex flex-col gap-0 items-center mb-2">
                    <h2 class="text-2xl font-bold">成績查詢</h2>
                    <p class="">View Grades</p>
                  </div>
                  <p class="mb-6" :class="[isLight ? 'text-slate-600' : 'text-zinc-300']">查看您的學習進度與成績<br>View Your Learning Progress and Grades</p>
                </div>
              </template>
            </Card>
          </div>
        </div>
      </div>

      <!-- 底部裝飾 -->
      <!-- <div class="h-[8%] bg-[#9ccafb] flex items-center justify-center shadow-inner">
        <img src="/images/down.png" alt="footer" class="h-full object-contain opacity-80" />
      </div> -->
      <div class="flex absolute bottom-2 justify-center w-full pb-2">
        <div class="flex w-[96%] h-[3px] bg-black justify-center" />
      </div>
    </div>
    <ConfirmDialog class="min-w-[25%]"/>
  </div>
</template>

<style scoped>
/* 卡片懸停效果 */
.p-card {
  transition: all 0.3s ease;
}

.p-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

/* 漸層背景動畫 */
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>