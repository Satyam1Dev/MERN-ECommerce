const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is defined
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('🔗 Connecting to MongoDB...');

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    // Remove the deprecated options: useNewUrlParser and useUnifiedTopology

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
  console.log('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected');
});

// Close connection when app is terminated
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔌 Mongoose connection closed through app termination');
  process.exit(0);
});

module.exports = connectDB;