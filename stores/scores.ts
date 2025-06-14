import { defineStore } from 'pinia'

export const useScoreStore = defineStore('score', () => {
  const score = ref({
    partA: 0,
    partB: 0,
    partC: 0,
  })

  const setScore = (part: 'partA' | 'partB' | 'partC', value: number) => {
    score.value[part] = value
  }

  const resetScore = () => {
    score.value.partA = 0
    score.value.partB = 0
    score.value.partC = 0
  }

  return {
    score,
    setScore,
    resetScore,
  }
})