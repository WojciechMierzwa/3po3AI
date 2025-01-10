import clientPromise from '../../../lib/mongodb';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide both username and password' });
  }

  try {
    // Połączenie z MongoDB
    const client = await clientPromise;
    const db = client.db('3po3DB'); // Domyślna baza danych, jeśli nie podano innej w URI
    const usersCollection = db.collection('Users'); // Kolekcja 'Users'

    // Sprawdzenie, czy użytkownik już istnieje
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hashowanie hasła
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tworzenie nowego użytkownika
    const newUser = {
      username,
      password: hashedPassword,
    };

    // Zapis użytkownika do bazy danych
    const result = await usersCollection.insertOne(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      user_id: result.insertedId, // Zwracamy ID nowego użytkownika
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
