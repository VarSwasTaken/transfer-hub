import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Missing MONGODB_URI environment variable.');
}

// Type narrowing for TypeScript
const mongodbUri: string = MONGODB_URI;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cached = globalForMongoose.mongooseCache ?? (globalForMongoose.mongooseCache = { conn: null, promise: null });

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = Promise.race([
      mongoose
        .connect(mongodbUri, {
          bufferCommands: false,
        })
        .catch((error) => {
          cached.promise = null;
          throw error;
        }),
      new Promise((_, reject) =>
        setTimeout(() => {
          cached.promise = null;
          reject(new Error('MongoDB connection timeout (5s). Check if your IP is whitelisted in MongoDB Atlas Network Access.'));
        }, 5000),
      ),
    ]);
  }

  cached.conn = await cached.promise;

  return cached.conn;
}
