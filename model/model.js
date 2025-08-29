import mongoose from 'mongoose';

// Define the schema
const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
});

export default mongoose.model('User', userSchema);