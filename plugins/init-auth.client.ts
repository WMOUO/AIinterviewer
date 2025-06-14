import { useUserStore } from '~/stores/user'
import type { User } from '~/stores/user'

export default defineNuxtPlugin(async () => {
  const userStore = useUserStore()

  if (!userStore.user) {
    const { data } = await useFetch<User>('/api/profile',{
      credentials: 'include'
    })

    if (data.value) {
      userStore.setUser({
        users_id: data.value.users_id,
        users_name: data.value.users_name,
        users_class: data.value.users_class,
      })
    }
  }
})