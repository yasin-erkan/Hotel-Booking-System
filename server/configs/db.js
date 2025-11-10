import mongoose from 'mongoose';

let MONGODB_URI = (process.env.MONGODB_URI || process.env.MONGO_URI)?.trim();

if (MONGODB_URI?.startsWith('MONGODB_URI=')) {
  MONGODB_URI = MONGODB_URI.replace(/^MONGODB_URI=/, '').trim();
}
if (MONGODB_URI?.startsWith('MONGO_URI=')) {
  MONGODB_URI = MONGODB_URI.replace(/^MONGO_URI=/, '').trim();
}

const MONGODB_DB = process.env.MONGODB_DB || 'Hoteluxe';

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = {conn: null, promise: null};
}

async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI or MONGO_URI environment variable is not set');
  }

  if (
    !MONGODB_URI.startsWith('mongodb://') &&
    !MONGODB_URI.startsWith('mongodb+srv://')
  ) {
    throw new Error('Invalid MongoDB URI format');
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (cached.promise) {
    return cached.promise;
  }

  cached.promise = (async () => {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
      }

      let connectionString = MONGODB_URI.trim();
      if (!connectionString.includes('?')) {
        connectionString = `${connectionString}?retryWrites=true&w=majority`;
      }

      const opts = {
        dbName: MONGODB_DB,
        bufferCommands: false,
        maxPoolSize: 1,
        minPoolSize: 0,
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 60000,
        connectTimeoutMS: 30000,
        heartbeatFrequencyMS: 10000,
        family: 4,
      };

      await mongoose.connect(connectionString, opts);
      cached.conn = mongoose.connection;
      return cached.conn;
    } catch (error) {
      cached.promise = null;
      console.error('MongoDB connection error:', error.message);
      throw error;
    }
  })();

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

const ensureConnection = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await connectDB();
      if (conn?.readyState === 1) {
        return conn;
      }
    } catch (error) {
      if (i === retries - 1) {
        throw new Error(`Failed to connect to MongoDB: ${error.message}`);
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

export {ensureConnection};
export default connectDB;
