import mongoose from 'mongoose';

export default defineNitroPlugin(async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('❌ MONGO_URI 未設定');
    return;
  }

  if (mongoose.connection.readyState === 1) {
    console.log('✅ 已連接 MongoDB（server/plugins/mongo.ts 已載入）');
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // 限制 5 秒內連線
    });

    console.log('✅ MongoDB 連線成功（來自 server/plugins/mongo.ts）');
  } catch (error) {
    console.error('❌ 無法連接 MongoDB:', error);
  }
});
