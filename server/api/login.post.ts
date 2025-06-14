import { supabase } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    // 取得請求的 body
    const body = await readBody(event)
    const { userId } = body

    // 驗證必填欄位
    if (!userId) {
      throw createError({
        statusCode: 400,
        statusMessage: '請提供使用者 ID'
      })
    }

    // 從 Supabase 查詢用戶
    const { data: user, error: fetchError } = await supabase
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
    // 回傳成功結果
    return {
      success: true,
      message: '登入成功',
      data: {
        user: {
          users_id: user.users_id,
          users_name: user.users_name,
          users_class: user.users_class,
        }
      }
    }

  } catch (error: any) {
    // 錯誤處理
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || '登入失敗'
    })
  }
})