import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const { period } = req.query;

  if (!["week", "month", "all-time"].includes(period)) {
    return res.status(400).json({ error: "Invalid period" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("3po3DB");

    const dateFilter = {
      week: new Date(new Date().setHours(0, 0, 0, 0) - 7 * 24 * 60 * 60 * 1000),
      month: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      "all-time": new Date(0),
    };

    const scores = await db.collection("Scores").aggregate([
      {
        $match: { date: { $gte: dateFilter[period] } },
      },
      {
        $addFields: {
          user_id: { $toObjectId: "$user_id" }, // Ensure it's an ObjectId
        },
      },
      {
        $lookup: {
          from: "Users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user", // Flatten the user array
      },
      {
        $project: {
          _id: 1,
          score: 1,
          name: "$user.name",
          profilePicture: { $ifNull: ["$user.profilePicture", "/images/profiles/pepe.jpg"] }, // Use default if no profile picture
          date: 1,
        },
      },
      {
        $sort: { score: -1 }, // Sort by score in descending order
      },
      {
        $limit: 50, // Limit to top 50
      },
    ]).toArray();

    // Map the result to ensure profilePicture is included with fallback
    const leaderboard = scores.map((entry) => ({
      _id: entry._id,
      score: entry.score,
      name: entry.name,
      image: entry.profilePicture,
      date: entry.date,
    }));

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("Error during leaderboard aggregation: ", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
