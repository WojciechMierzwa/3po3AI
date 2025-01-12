import clientPromise from "../../lib/mongodb";
import jwt from 'jsonwebtoken';  // Importing jsonwebtoken
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { profilePicture } = req.body;

  // Ensure the user is authenticated
  const token = req.headers.authorization?.split(' ')[1]; // Get token from the Authorization header
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Decode the token to get user info
    const decodedToken = jwt.decode(token);  // Use jwt.decode to decode the token
    if (!decodedToken) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const userId = decodedToken.id; // Assuming the ID is stored in the token

    const client = await clientPromise;
    const db = client.db("3po3DB");

    // Update the profile picture for the logged-in user
    const result = await db.collection("Users").updateOne(
      { _id: new ObjectId(userId) },
      { $set: { profilePicture } }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: 'Failed to update profile picture' });
    }

    res.status(200).json({ message: 'Profile picture updated successfully' });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
