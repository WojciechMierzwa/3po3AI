import { ObjectId } from "mongodb";  // Import ObjectId from the MongoDB driver
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { score, date, user_id } = req.body;

      // Validate inputs
      if (typeof score !== "number" || !date || !user_id) {
        return res.status(400).json({ message: "Invalid input" });
      }

      // Ensure the user_id is a valid ObjectId
      if (!ObjectId.isValid(user_id)) {
        return res.status(400).json({ message: "Invalid user_id" });
      }

      const client = await clientPromise;
      const db = client.db("3po3DB");

      // Insert the score with the date and user_id (as ObjectId)
      await db.collection("Scores").insertOne({
        score,
        date: new Date(date),
        user_id: new ObjectId(user_id), // Convert the user_id string to ObjectId
        createdAt: new Date(),
      });

      return res.status(201).json({ message: "Score inserted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    // Handle unsupported HTTP methods
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
