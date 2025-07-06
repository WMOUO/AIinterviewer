// login.post.ts
import { SignJWT } from 'jose'
import { setCookie } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || 'your-secret-key'
)

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseClient(event)
    const body = await readBody(event)
    const { userId } = body

    if (!userId) {
      throw createError({ statusCode: 400, statusMessage: '請提供使用者 ID' })
    }

    const { data: user, error: fetchError } = await client
      .from('users')
      .select('*')
      .eq('users_id', userId)
      .single()

    if (fetchError || !user) {
      throw createError({
        statusCode: 401,
        statusMessage: '找不到此使用者 ID，請確認輸入是否正確'
      })
    }

    // jose：簽 Token（必須 await）
    const token = await new SignJWT({ users_id: user.users_id })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setExpirationTime('2h')
      .sign(SECRET_KEY)

    setCookie(event, 'token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 2 // 2 小時
    })

    return {
      success: true,
      message: '登入成功',
      data: {
        user: {
          users_id: user.users_id,
          users_name: user.users_name,
          users_class: user.users_class
        }
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || '登入失敗'
    })
  }
})
