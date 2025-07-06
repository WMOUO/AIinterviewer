// verifyToken.ts
import { jwtVerify } from 'jose'
import { parseCookies } from 'h3'

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY || 'fallback-secret'
)

export const verifyToken = async (event: any) => {
  const { token } = parseCookies(event)
  if (!token) throw createError({ statusCode: 401, statusMessage: '未登入' })

  try {
    const { payload } = await jwtVerify<{ users_id: string }>(token, SECRET_KEY, {
      algorithms: ['HS256']
    })
    return payload
  } catch {
    throw createError({ statusCode: 403, statusMessage: 'Token 驗證失敗' })
  }
}
