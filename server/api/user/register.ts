import { defineEventHandler, readBody } from 'h3';
import bcrypt from 'bcryptjs';
import User from '~/server/models/User';

export default defineEventHandler(async (event) => {
    try {
    const body = await readBody(event);
    console.log(body)
    // 確保所有欄位都有提供
    if (!body.username || !body.password || !body.email) {
        return { success: false, message: '缺少必要欄位' };
    }

    // 檢查是否已經有相同 email 或 username
    const existingUser = await User.findOne({ $or: [{ email: body.email }, { username: body.username }] });
    if (existingUser) {
        return { success: false, message: '使用者名稱或信箱已被註冊' };
    }

    // 加密密碼
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // 建立新使用者
    const newUser = new User({
        username: body.username,
        password: hashedPassword,
        email: body.email,
    });
    

    await newUser.save();

    return { success: true, message: '註冊成功' };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, message: '操作失敗', error: error.message };
        }
            return { success: false, message: '操作失敗', error: '未知錯誤' };
    }
});
