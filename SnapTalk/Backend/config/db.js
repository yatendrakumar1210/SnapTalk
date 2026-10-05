const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb+srv://ytofficial:YT639588@cluster0.yeq7xry.mongodb.net/Snaptalk';
    await mongoose.connect(uri, {
      dbName: 'Snaptalk'
    });
    console.log("MongoDB Database Connected Successfully to Snaptalk");
  } catch (error) {
    console.error("DB Connection Error:", error.message);
  }
};

module.exports = { connectDB };
