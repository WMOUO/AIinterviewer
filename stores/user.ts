import { defineStore } from 'pinia'

export interface User {
  users_id: string
  users_name: string
  users_class: string
}


export const useUserStore = defineStore('user', () => {
  const user = ref<null | User>(null)

  const setUser = (userData: User) => {
    user.value = userData
  }

  const clearUser = () => {
    user.value = null
  }

const isLoggedIn = computed(() => !!user.value)

  return {
    user,
    setUser,
    clearUser
  }
})