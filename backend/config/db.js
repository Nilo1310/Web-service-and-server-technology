const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MongoDB connection error: MONGO_URI is missing from .env');
    return false;
  }

  if (mongoose.connection.readyState === 1) {
    return true;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB Connected');
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    return false;
  }
};

module.exports = connectDB;
