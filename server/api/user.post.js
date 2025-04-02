import { defineEventHandler, readBody, createError } from "h3"
import User from "../models/userModel"
import mongoose from "mongoose"

export default defineEventHandler(async (event) => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI, {
        dbName: process.env.DB_NAME,
        serverSelectionTimeoutMS: 5000,
      })
    }

    const { name, email } = await readBody(event)
    if (!name) {
      throw new Error("Missing required field: name")
    }
    if (!email) {
      throw new Error("Missing required field: email")
    }

    await User.create({ name, email })

    const user = await User.findOne({ email })
    if (email) {
      throw new Error("User already exists")
    }

    return user
  } catch (err) {
    return createError({
      statusCode: 500,
      statusMessage: err.message,
    })
  }
})
