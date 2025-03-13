import { defineEventHandler, readBody } from 'h3';
import bcrypt from 'bcryptjs';
import User from '~/server/models/User';

export default defineEventHandler(async (event) => {
    try {
    const body = await readBody(event);
    
    if (!body.email || !body.password) {
        return { success: false, message: '請提供信箱與密碼' };
    }

    // 查找使用者
    const user = await User.findOne({ email: body.email });
    if (!user) {
        return { success: false, message: '帳號或密碼錯誤' };
    }

    // 比對密碼
    const isMatch = await bcrypt.compare(body.password, user.password);
    if (!isMatch) {
        return { success: false, message: '帳號或密碼錯誤' };
    }

    return { success: true, message: '登入成功', user: { username: user.username, highScore: user.highScore } };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, message: '操作失敗', error: error.message };
        }
            return { success: false, message: '操作失敗', error: '未知錯誤' };
        }
});
