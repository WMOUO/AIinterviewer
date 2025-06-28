<script setup lang="ts">
type UserRow = {
  users_id: string
  users_name: string
  users_class: string
}

type ScoreWithUser = {
  scores_id: string
  scores_score: number
  scores_date: string
  users_id: string
  users: {
    users_name: string
    users_class: string
  }
}

const userStore = useUserStore()
const userId = userStore.user?.users_id
const userClass = userStore.user?.users_class

const supabase = useSupabaseClient()

const myScores = ref<ScoreWithUser[]>([])
const classScores = ref<ScoreWithUser[]>([])

onMounted(async() => {
  const { data: allId , error: allIdErr } = await supabase
    .from('users')
    .select('users_id, users_name')
    .eq('users_class', userClass as string)
  if (allIdErr) {
    console.log(allIdErr)
  }
  // 強制轉型
  let allIdRow = allId as UserRow[]
  let allIdArray = allIdRow?.map(i => i.users_id)
  
  const { data: allScores, error: allScoresErr } = await supabase.from('score').select(`
      scores_id,
      scores_score,
      scores_date,
      users_id,
      users (
        users_name,
        users_class
      )
    `)
    .in('users_id', allIdArray)
    .order('scores_score', { ascending:false}) // 降冪排序
  if (allScoresErr) {
    console.log(allScoresErr)
    return
  }
  classScores.value = allScores
  myScores.value = classScores.value.filter((i) => i.users_id === userId)
  console.log(myScores.value[0])
  
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-[#d6e2ef] to-[#9ccafb] p-8">
    <div class="max-w-5xl mx-auto">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">成績查詢</h1>

      <!-- 自己的成績 -->
      <Card class="mb-10 !bg-white/90 backdrop-blur-sm shadow-lg">
        <template #header>
          <h2 class="text-xl font-semibold text-gray-700 p-4">您的成績</h2>
        </template>
        <template #content>
          <table class="w-full table-auto border-collapse">
            <thead>
              <tr class="bg-gray-100 text-gray-700">
                <th class="py-2 px-4 border">考試日期</th>
                <th class="py-2 px-4 border">分數</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(score, index) in myScores" :key="index" class="text-center">
                <td class="py-2 px-4 border text-gray-600">{{ score.scores_date }}</td>
                <td class="py-2 px-4 border text-green-600 font-bold">{{ score.scores_score }}</td>
              </tr>
            </tbody>
          </table>
        </template>
      </Card>

      <!-- 班級排名 -->
      <Card class="!bg-white/90 backdrop-blur-sm shadow-lg">
        <template #header>
          <h2 class="text-xl font-semibold text-gray-700 p-4">班級成績排名</h2>
        </template>
        <template #content>
          <table class="w-full table-auto border-collapse">
            <thead>
              <tr class="bg-gray-100 text-gray-700">
                <th class="py-2 px-4 border">名次</th>
                <th class="py-2 px-4 border">使用者 ID</th>
                <th class="py-2 px-4 border">考試日期</th>
                <th class="py-2 px-4 border">分數</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(score, index) in classScores" :key="index" class="text-center text-gray-600">
                <td class="py-2 px-4 border">{{ index + 1 }}</td>
                <td class="py-2 px-4 border">{{ score.users_id }}</td>
                <td class="py-2 px-4 border">{{ score.scores_date }}</td>
                <td class="py-2 px-4 border text-blue-600 font-semibold">{{ score.scores_score }}</td>
              </tr>
            </tbody>
          </table>
        </template>
      </Card>
    </div>
  </div>
</template>
