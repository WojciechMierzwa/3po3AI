export default async function GameCountPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stats`, { cache: 'no-store' });
  const stats = await res.json();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">Statystyki</h1>
        <div className="space-y-4">
          <p className="text-lg font-semibold text-gray-700 flex justify-center">
            <span className="font-medium text-center">Całkowita liczba 👤: </span> {stats.total_users}
          </p>
          <p className="text-lg font-semibold text-gray-700 flex justify-center">
            <span className="font-medium text-center">Całkowita liczba 🎮: </span> {stats.total_games}
          </p>
        </div>
      </div>
    </div>
  );
}
