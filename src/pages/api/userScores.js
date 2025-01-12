import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { user } = req.query;

  if (!user) {
    return res.status(400).json({ error: "User is required" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("3po3DB");

    // Fetch user details including profilePicture
    const userData = await db.collection("Users").findOne(
      { name: user },
      { projection: { name: 1, profilePicture: 1 } } // Include only relevant fields
    );
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch all scores sorted from highest to lowest
    const allScores = await db
      .collection("Scores")
      .find({})
      .sort({ score: -1 })
      .toArray();

    // Find the user's best score and ranking position
    const userBestScore = await db
      .collection("Scores")
      .find({ user_id: userData._id })
      .sort({ score: -1 })
      .limit(1)
      .toArray();

    const bestScore = userBestScore[0]?.score || 0;
    const rankingPosition = allScores.findIndex(
      (entry) =>
        entry.score === bestScore &&
        entry.user_id.toString() === userData._id.toString()
    ) + 1;

    // Fetch all scores for the user
    const userScores = await db
      .collection("Scores")
      .find({ user_id: userData._id })
      .sort({ date: -1 })
      .toArray();

    // Respond with user details and scores
    res.status(200).json({
      name: userData.name,
      profilePicture: userData.profilePicture || "/images/profiles/pepe.jpg", // Use profilePicture field
      lastGame: userScores[0] || {},
      bestScore,
      ranking: rankingPosition,
      scores: userScores,
    });
  } catch (error) {
    console.error("Error fetching user scores:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
