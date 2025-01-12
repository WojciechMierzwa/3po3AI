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

    // Check for daily login reward
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to midnight for daily checks
    let rewardGiven = false;
    if (!user.lastRewardDate || new Date(user.lastRewardDate) < today) {
      // Reward user with coins if they haven't received it today
      const coinsToAward = 10; // Adjust the reward amount as needed
      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: { lastRewardDate: new Date() }, // Update last reward date to today
          $inc: { coins: coinsToAward }, // Increment coin balance
        }
      );
      rewardGiven = true;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      token,
      message: rewardGiven
        ? `Login successful! You have been awarded 10 coins.`
        : `Login successful! No reward today, you've already claimed it.`,
      coins: user.coins + (rewardGiven ? 10 : 0), // Updated coin balance
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
}
