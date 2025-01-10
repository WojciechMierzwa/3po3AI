import clientPromise from '../../../lib/mongodb';  // Import MongoDB connection
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, password } = req.body;  // Replace username with name

  if (!name || !password) {
    return res.status(400).json({ message: 'Please provide both name and password' });  // Adjust error message
  }

  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('3po3DB');  // Default database
    const usersCollection = db.collection('Users'); // Collection 'Users'

    // Find user by name
    const user = await usersCollection.findOne({ name });  // Search by name instead of username
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, name: user.name },  // Use name in the payload
      process.env.JWT_SECRET,  // JWT secret from .env.local
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
}
