import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { user } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sortBy = req.query.sortBy || "score"; // Default sorting by score
  const sortOrder = req.query.sortOrder === "desc" ? -1 : 1; // Sort by descending or ascending order

  if (!user) {
    return res.status(400).json({ error: "User is required" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("3po3DB");

    // Fetch user details including profilePicture and coins
    const userData = await db.collection("Users").findOne(
      { name: user },
      { projection: { name: 1, profilePicture: 1, coins: 1 } } // Include coins field here
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

    // Fetch all scores for the user, with pagination and sorting
    const userScores = await db.collection("Scores").aggregate([
      {
        $lookup: {
          from: "Users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $match: { "user.name": user } },
      { $sort: { [sortBy]: sortOrder } },
      { $skip: (page - 1) * limit }, // Apply pagination
      { $limit: limit }, // Limit results
      { $project: { score: 1, date: 1, _id: 0 } },
    ]).toArray();

    // Respond with user details, scores, ranking information, and coins
    res.status(200).json({
      name: userData.name,
      profilePicture: userData.profilePicture || "/images/profiles/pepe.jpg", // Use profilePicture if available
      coins: userData.coins || 0,  // Include coins data
      lastGame: userScores[0] || {}, // Last game details (first score in the sorted list)
      bestScore,
      ranking: rankingPosition,
      scores: userScores,
    });
  } catch (error) {
    console.error("Error fetching user scores:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
