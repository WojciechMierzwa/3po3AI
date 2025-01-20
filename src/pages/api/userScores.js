import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { user } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sortBy = req.query.sortBy || "score";
  const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

  if (!user) {
    return res.status(400).json({ error: "User is required" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("3po3DB");

    const userData = await db.collection("Users").findOne(
      { name: user },
      { projection: { name: 1, profilePicture: 1, coins: 1 } }
    );
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    const allScores = await db.collection("Scores").find({ user_id: userData._id }).sort({ score: -1 }).toArray();
    const userBestScore = await db.collection("Scores").find({ user_id: userData._id }).sort({ score: -1 }).limit(1).toArray();
    const bestScore = userBestScore[0]?.score || 0;
    const rankingPosition = allScores.findIndex(
      (entry) =>
        entry.score === bestScore &&
        entry.user_id.toString() === userData._id.toString()
    ) + 1;

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
      { $skip: (page - 1) * limit },
      { $limit: limit },
      { $project: { score: 1, date: 1, _id: 0 } },
    ]).toArray();

    const totalScores = await db.collection("Scores").countDocuments({ user_id: userData._id });
    const totalPages = Math.ceil(totalScores / limit);

    res.status(200).json({
      name: userData.name,
      profilePicture: userData.profilePicture || "/images/profiles/pepe.jpg",
      coins: userData.coins || 0,
      lastGame: userScores[0] || {},
      bestScore,
      ranking: rankingPosition,
      scores: userScores,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching user scores:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
