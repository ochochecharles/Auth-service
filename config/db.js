import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // loads .env into process.env

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
    } catch (error) {
        console.log(`${error} Error connecting to database`)
    }
}