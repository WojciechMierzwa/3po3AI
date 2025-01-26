import { ObjectId } from "mongodb";  
import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const client = await clientPromise;
      const db = client.db("3po3DB");

      // Zliczamy ilosc w kolekcjach
      const total_users = await db.collection("Users").countDocuments();
      const total_games = await db.collection("Scores").countDocuments();

      return res.status(200).json({ total_users, total_games });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
