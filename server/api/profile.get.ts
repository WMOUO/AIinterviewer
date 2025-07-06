import jwt from 'jsonwebtoken'
import { serverSupabaseClient } from '#supabase/server'

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const token = getCookie(event, 'token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: '未登入' })
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { users_id: string }

    const { data: user, error } = await client
      .from('users')
      .select('users_id, users_name, users_class')
      .eq('users_id', decoded.users_id)
      .single()

    if (error || !user) {
      throw createError({ statusCode: 404, statusMessage: '找不到使用者' })
    }

    return {
      users_id: user.users_id,
      users_name: user.users_name,
      users_class: user.users_class
    }

  } catch (err) {
    throw createError({ statusCode: 403, statusMessage: 'Token 驗證失敗' })
  }
})
function useSupabaseClient() {
  throw new Error('Function not implemented.')
}

