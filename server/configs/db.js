import mongoose from 'mongoose';

// Support both MONGODB_URI and MONGO_URI for flexibility
const MONGODB_URI = (process.env.MONGODB_URI || process.env.MONGO_URI)?.trim();
const MONGODB_DB = process.env.MONGODB_DB || 'Hoteluxe';

// Cache the connection to reuse across serverless function invocations
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {conn: null, promise: null};
}

async function connectDB() {
  // Check if MONGODB_URI or MONGO_URI is set
  if (!MONGODB_URI) {
    console.error('Environment variables:', {
      MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT SET',
      MONGO_URI: process.env.MONGO_URI ? 'SET' : 'NOT SET',
    });
    throw new Error(
      'MONGODB_URI or MONGO_URI environment variable is not set. Please set it in Vercel Environment Variables.',
    );
  }

  // Validate connection string format
  if (
    !MONGODB_URI.startsWith('mongodb://') &&
    !MONGODB_URI.startsWith('mongodb+srv://')
  ) {
    console.error(
      'Invalid MongoDB URI format:',
      MONGODB_URI.substring(0, 20) + '...',
    );
    throw new Error(
      `Invalid MongoDB URI format. Expected to start with "mongodb://" or "mongodb+srv://", got: ${MONGODB_URI.substring(
        0,
        30,
      )}...`,
    );
  }

  // If already connected, return existing connection
  if (cached.conn && mongoose.connection.readyState === 1) {
    console.log('Using existing MongoDB connection');
    return cached.conn;
  }

  // If connection is in progress, wait for it
  if (cached.promise) {
    console.log('MongoDB connection in progress, waiting...');
    return cached.promise;
  }

  // Start new connection
  cached.promise = (async () => {
    try {
      // Close existing connection if disconnected
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
      }

      // Build connection string (trim and clean)
      let connectionString = MONGODB_URI.trim();
      if (!connectionString.includes('?')) {
        connectionString = `${connectionString}?retryWrites=true&w=majority`;
      }

      const opts = {
        dbName: MONGODB_DB,
        bufferCommands: false, // Disable mongoose buffering - CRITICAL for serverless
        bufferMaxEntries: 0, // Disable mongoose buffering - CRITICAL for serverless
        maxPoolSize: 1, // Reduce pool size for serverless (reuse connection)
        minPoolSize: 0, // Allow connection to close when idle
        serverSelectionTimeoutMS: 30000, // Increase to 30 seconds
        socketTimeoutMS: 60000, // Increase to 60 seconds
        connectTimeoutMS: 30000, // Add connection timeout
        heartbeatFrequencyMS: 10000, // Keep connection alive
        family: 4, // Use IPv4, skip trying IPv6
      };

      console.log(`Connecting to MongoDB: ${MONGODB_DB}`);
      await mongoose.connect(connectionString, opts);

      cached.conn = mongoose.connection;
      console.log(`MongoDB connected successfully to database: ${MONGODB_DB}`);

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

// Helper function to ensure connection with retry
const ensureConnection = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`MongoDB connection attempt ${i + 1}/${retries}`);
      const conn = await connectDB();
      if (conn && conn.readyState === 1) {
        console.log(`MongoDB connection successful on attempt ${i + 1}`);
        return conn;
      }
      throw new Error('Connection established but readyState is not 1');
    } catch (error) {
      console.error(`Connection attempt ${i + 1} failed:`, error.message);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack?.substring(0, 200),
      });

      if (i === retries - 1) {
        throw new Error(
          `Failed to connect to MongoDB after ${retries} attempts: ${error.message}. Please check: 1) MongoDB Atlas Network Access allows 0.0.0.0/0, 2) Connection string is correct, 3) Database user has proper permissions.`,
        );
      }
      // Wait before retry (exponential backoff with longer delays)
      const delay = 2000 * (i + 1);
      console.log(`Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Export both default and named exports
export {ensureConnection};
export default connectDB;
