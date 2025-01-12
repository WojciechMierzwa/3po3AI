import clientPromise from '../../../lib/mongodb';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Coś nei działa' });
  }

  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: 'Proszę podaj login i hasło' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('3po3DB'); 
    const usersCollection = db.collection('Users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ message: 'Użytkownik już instnieje' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with a default profile picture
    const newUser = {
      name,
      password: hashedPassword,
      profilePicture: '/images/profiles/pepe.jpg', // Default profile picture
    };

    // Insert the new user into the database
    const result = await usersCollection.insertOne(newUser);

    res.status(201).json({
      message: 'Użytkownik zarejestrowany',
      user_id: result.insertedId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Błąd systemu' });
  }
}
