import mongoose from "mongoose";

// defining connection cache type
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// extend the global object to include the connection cache
declare global {
  var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// initialize the cache on the global object to persist across hot reloads in development
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose> {
  // if conn exists, return it
  if (cached.conn) {
    return cached.conn;
  }

  // return existing connection promise if one is in progress
  if (!cached.promise) {
    const options = {
      bufferCommands: false,
    };

    // create a new connection promise
    cached.promise = mongoose.connect(MONGODB_URI, options).then((m) => {
      return m;
    });
  }

  try {
    // wait for connection to establish
    cached.conn = await cached.promise;
  } catch (error) {
    // reset promise on error to allow retry
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
