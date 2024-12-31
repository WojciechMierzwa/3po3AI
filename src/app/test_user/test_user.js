import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("3po3DB");

    // Automatically insert a test user and score each time the route is loaded
    const testUser = {
      name: "Test User",
      email: `test${Date.now()}@example.com`, // Unique email for each test user
    };

    const userResult = await db.collection("Users").insertOne(testUser);

    const testScore = {
      user_id: userResult.insertedId, // Use the ID of the newly created user
      score: 1,
      date: new Date(),
      createdAt: new Date(),
    };

    await db.collection("Scores").insertOne(testScore);

    if (req.method === "GET") {
      // Fetch scores
      const scores = await db.collection("Scores").aggregate([
        {
          $lookup: {
            from: "Users",           // Join with the Users collection
            localField: "user_id",   // Field in Scores
            foreignField: "_id",     // Field in Users
            as: "userDetails",       // Output field for the joined data
          },
        },
        {
          $unwind: "$userDetails",   // Flatten the joined data
        },
        {
          $project: {                // Select specific fields to return
            score: 1,
            date: 1,
            "userDetails.name": 1,
            "userDetails.email": 1,
          },
        },
      ]).toArray();

      return res.status(200).json(scores);

    } else if (req.method === "POST") {
      // Add a new score
      const { user_id, score, date } = req.body;

      if (!user_id || !score || !date) {
        return res.status(400).json({ message: "Missing user_id, score, or date" });
      }

      // Insert the new score
      const result = await db.collection("Scores").insertOne({
        user_id: new ObjectId(user_id), // Ensure user_id is an ObjectId
        score,
        date: new Date(date),           // Ensure date is stored as a Date object
        createdAt: new Date(),
      });

      return res.status(201).json({ message: "Score added successfully", scoreId: result.insertedId });

    } else {
      // Method not allowed
      res.setHeader("Allow", ["GET", "POST"]); // Ensure this line is executed in the right context
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
