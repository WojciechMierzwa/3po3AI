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

    // Pobierz użytkownika
    const userData = await db.collection("Users").findOne({ name: user });
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    // Pobierz wszystkie wyniki posortowane od największego do najmniejszego
    const allScores = await db
      .collection("Scores")
      .find({})
      .sort({ score: -1 })
      .toArray();

    // Znajdź najlepszy wynik użytkownika i jego pozycję w rankingu
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

    // Pobierz wszystkie wyniki użytkownika
    const userScores = await db
      .collection("Scores")
      .find({ user_id: userData._id })
      .sort({ date: -1 })
      .toArray();

    res.status(200).json({
      name: userData.name,
      image: userData.image || "/images/default.jpg",
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
