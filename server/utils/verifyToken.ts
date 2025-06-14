import jwt from 'jsonwebtoken'
import { parseCookies } from 'h3'

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'fallback-secret'

export const verifyToken = (event: any) => {
  const cookies = parseCookies(event)
  const token = cookies.token

  if (!token) throw createError({ statusCode: 401, statusMessage: '未登入' })

  try {
    return jwt.verify(token, SECRET_KEY) as { users_id: string }
  } catch {
    throw createError({ statusCode: 403, statusMessage: 'Token 驗證失敗' })
  }
}