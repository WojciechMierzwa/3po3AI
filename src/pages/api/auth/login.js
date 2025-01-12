import clientPromise from '../../../lib/mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: 'Please provide both name and password' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('3po3DB');
    const usersCollection = db.collection('Users');

    // Find user by name
    const user = await usersCollection.findOne({ name });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Ensure the user has a profilePicture field
    if (!user.profilePicture) {
      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { profilePicture: '/images/profiles/default.jpg' } }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
}
