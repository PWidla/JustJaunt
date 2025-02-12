import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

interface Trip {
  _id: string;
  name: string;
  days: number;
}

const MyTrips = () => {
  const { loggedInUser } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        if (loggedInUser?.id) {
          const response = await fetch(
            `http://localhost:3000/trip/user/${loggedInUser.id}`
          );
          const data = await response.json();
          if (response.ok) {
            setTrips(data.trips);
          } else {
            setError(data.message || "Error fetching trips");
          }
        }
      } catch (err) {
        setError("Failed to fetch trips.");
      } finally {
        setLoading(false);
      }
    };

    if (loggedInUser?.id) {
      fetchTrips();
    }
  }, [loggedInUser]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-r from-dark-green to-light-green text-white w-full h-screen font-primaryRegular">
      <div className="text-center mb-8 w-full">
        <h1 className="text-4xl font-primaryBold mb-4">My Trips</h1>
        <p className="mt-2 text-lg">Here are your saved trips.</p>
      </div>
      {trips.length === 0 ? (
        <div className="text-center text-xl text-gray-700">
          No trips found. Plan your first trip!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-4">
          {trips.map((trip) => (
            <div
              key={trip._id}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold text-dark-green">
                {trip.name}
              </h2>
              <p className="text-gray-600">Days: {trip.days}</p>
              <Link
                to={`/trip/${trip._id}`}
                className="text-indigo-600 hover:text-indigo-800 mt-4 inline-block"
              >
                View Trip
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTrips;
