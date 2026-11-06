const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }
  try {
    const uri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      'mongodb+srv://tharukanishadi2023_db_user:Nishadi12345@cluster0.xj4reyt.mongodb.net/university_canteen?retryWrites=true&w=majority';
    const conn = await mongoose.connect(uri);
    isConnected = true;
    console.log(`[MongoDB Connected] Host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
  }
};

module.exports = connectDB;
