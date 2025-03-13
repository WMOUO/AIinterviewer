import { defineEventHandler } from 'h3';
import mongoose from 'mongoose';

export default defineEventHandler(async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    return { success: false, message: 'MONGO_URI 未設定' };
  }

  try {
    await mongoose.connect(mongoUri); // 直接使用 mongoose.connect()，不需要額外的選項

    return { success: true, message: 'MongoDB 連線成功！' };
  } catch (error: unknown) { // 明確指定 error 型別
    if (error instanceof Error) {
      return { success: false, message: 'MongoDB 連線失敗', error: error.message };
    }
    return { success: false, message: 'MongoDB 連線失敗', error: '未知錯誤' };
  }
});
