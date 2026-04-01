import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  tls: true,
  tlsAllowInvalidCertificates: true,
};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable so the connection is preserved
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, it's best to not use a global variable
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// Helper function to get database
export async function getDb() {
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB || 'refund_requests');
}

// Helper function to get collection
export async function getRefundRequestsCollection() {
  const db = await getDb();
  return db.collection('refund_requests');
}
