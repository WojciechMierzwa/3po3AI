import clientPromise from "../../lib/mongodb";
import jwt from 'jsonwebtoken';
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET; // Ensure you have a secret for verifying the token

export default async function handler(req, res) {
  const { profilePicture } = req.body;

  if (!profilePicture) {
    return res.status(400).json({ error: 'Profile picture URL is required' });
  }

  const token = req.headers.authorization?.split(' ')[1]; // Extract token from the header
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token missing' });
  }

  try {
    // Verify the token to ensure it's valid
    const decodedToken = jwt.verify(token, JWT_SECRET);
    if (!decodedToken) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const userId = decodedToken.id; // Assuming the token contains the user's ID
    if (!userId) {
      return res.status(400).json({ error: 'Invalid token payload' });
    }

    const client = await clientPromise;
    const db = client.db("3po3DB");

    // Update the user's profile picture in the database
    const result = await db.collection("Users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { profilePicture } }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: 'Failed to update profile picture' });
    }

    res.status(200).json({ message: 'Profile picture updated successfully' });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }

    console.error('Error updating profile picture:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
