import { defineEventHandler } from 'h3';
import mongoose from 'mongoose';
import User from '~/server/models/User';

export default defineEventHandler(async () => {
  if (mongoose.connection.readyState !== 1) {
    return { success: false, message: 'MongoDB 尚未連線，請稍後再試' };
  }

  try {
    const users = await User.find().select('-password'); // 確保不回傳密碼
    return { success: true, users };
  } catch (error) {
    return { success: false, message: '操作失敗', error: error instanceof Error ? error.message : '未知錯誤' };
  }
});
