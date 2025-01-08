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
          user_id: { $toObjectId: "$user_id" }, // Upewnij się, że jest ObjectId
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
        $unwind: "$user", // Rozwija tablicę użytkowników
      },
      {
        $project: {
          _id: 1,
          score: 1,
          name: "$user.name",
          date: 1,
        },
      },
      {
        $sort: { score: -1 }, // Sortuj wyniki malejąco
      },
      {
        $limit: 50, // Pobierz tylko top 50
      },
    ]).toArray();

    res.status(200).json(scores);
  } catch (error) {
    console.error("Error during leaderboard aggregation: ", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
