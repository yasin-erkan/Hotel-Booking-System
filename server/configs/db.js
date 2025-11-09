import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () =>
      console.log('MongoDB connected successfully'),
    );
    const uri =
      process.env.MONGODB_URI?.includes('mongodb://') ||
      process.env.MONGODB_URI?.includes('mongodb+srv://')
        ? process.env.MONGODB_URI
        : null;

    if (!uri) {
      throw new Error('MONGODB_URI env var missing');
    }

    await mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB || 'Hoteluxe',
    });
  } catch (error) {
    console.log('MongoDB connection error:', error.message);
  }
};

export default connectDB;
