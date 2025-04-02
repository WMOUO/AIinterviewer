import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

console.log("connecting...")

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
      serverSelectionTimeoutMS: 5000,
    })
    console.log("DB connected")
  } catch (err) {
    console.error("DB connected error :", err)
  }
}

connectDB().then(() => {
  console.log("Server Runing...")
  setInterval(() => {}, 1000)
})
