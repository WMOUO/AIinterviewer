import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // 密碼應加密
    birthday: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    email: { type: String, required: true, unique: true },
    highScore: { type: Number, default: 0 }
}, { collection: 'users' });

export default mongoose.model('User', UserSchema);
