import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const { user } = req.query;

  if (!user) {
    return res.status(400).json({ error: "User is required" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("3po3DB");

    const userScores = await db.collection("Scores").aggregate([
      {
        $lookup: {
          from: "Users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $match: {
          "user.name": user,
        },
      },
      {
        $project: {
          score: 1,
          date: 1,
          _id: 0,
        },
      },
    ]).toArray();

    res.status(200).json(userScores);
  } catch (error) {
    console.error("Error fetching user scores:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
