import express from 'express';
import userRouter from './routes/route.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';

dotenv.config(); // loads .env into process.env

const app = express();
app.use(express.json());
app.use('/users', userRouter);

connectDB().then(() => {
  console.log('MongoDB connected');
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // stop the process if DB connection fails
});