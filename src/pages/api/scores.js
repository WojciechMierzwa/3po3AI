import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("3po3DB"); 

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
    ]).toArray();

    res.status(200).json(scores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data" });
  }
}
