import clientPromise from '../../../lib/mongodb';  // Import połączenia MongoDB
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
    const db = client.db('3po3DB');  // Domyślna baza danych
    const usersCollection = db.collection('Users'); // Kolekcja 'Users'

    // Szukamy użytkownika po nazwie użytkownika
    const user = await usersCollection.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Porównanie hasła
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generowanie tokenu JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,  // Sekret JWT z .env.local
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
}
