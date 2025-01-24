import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type: 'string',
        required: true
    },
    email: {
        type: 'string',
        required: true,
        unique: true
    }
}, {
    versionKey: false
});

const User = mongoose.model('User', userSchema);
// dbname 大寫對應複數型態 例：user => user,User=>users

export default User;