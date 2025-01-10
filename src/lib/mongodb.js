import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // Wczytanie URI z zmiennej środowiskowej
const options = {};

let client;
let clientPromise;

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // W środowisku deweloperskim używamy globalnej zmiennej, aby połączenie było ponownie używane przy hot reload
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // W produkcji tworzymy nowe połączenie
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
