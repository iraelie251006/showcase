import 'server-only';
import { MongoClient } from 'mongodb';

const globalMongo = globalThis as typeof globalThis & { portfolioMongo?: Promise<MongoClient> };

export function isDatabaseConfigured() {
  return Boolean(process.env.MONGODB_URI && process.env.MONGODB_DB);
}

export async function getDatabase() {
  if (!isDatabaseConfigured()) throw new Error('Admin database is not configured.');
  if (!globalMongo.portfolioMongo) {
    const client = new MongoClient(process.env.MONGODB_URI!, {
      maxPoolSize: 5,
      maxIdleTimeMS: 60000,
      serverSelectionTimeoutMS: 5000,
    });
    globalMongo.portfolioMongo = client.connect().catch((error) => {
      globalMongo.portfolioMongo = undefined;
      throw error;
    });
  }
  return (await globalMongo.portfolioMongo).db(process.env.MONGODB_DB!);
}
