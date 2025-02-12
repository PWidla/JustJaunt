import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { Description, Dialog, DialogTitle } from "@headlessui/react";

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);

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

  const deleteTrip = async (tripId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/trip/${tripId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok) {
        setTrips((prevTrips) =>
          prevTrips.filter((trip) => trip._id !== tripId)
        );
        setIsDeleteDialogOpen(false);
      } else {
        setError(data.message || "Error deleting trip");
      }
    } catch (err) {
      setError("Failed to delete trip.");
    }
  };

  const openDeleteDialog = (trip: Trip) => {
    setTripToDelete(trip);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setTripToDelete(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-r from-dark-green to-light-green text-white w-full min-h-screen font-primaryRegular p-6">
      <div className="text-center mb-8 w-full">
        <h1 className="text-4xl font-primaryBold mb-4 text-white">My Trips</h1>
        <p className="mt-2 text-lg text-white">Here are your saved trips.</p>
      </div>
      {trips.length === 0 ? (
        <div className="text-center text-xl text-gray-700">
          No trips found. Plan your first trip!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
          {trips.map((trip) => (
            <div
              key={trip._id}
              className="bg-light-brown p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center text-center"
            >
              <h2 className="text-xl font-semibold text-white mb-2">
                {trip.name}
              </h2>
              <p className="text-white text-lg mb-4">Days: {trip.days}</p>
              <Link
                to={`/trip/${trip._id}`}
                className="text-indigo-600 hover:text-indigo-800 mt-2 inline-block text-lg font-semibold"
              >
                View Trip
              </Link>
              <button
                onClick={() => openDeleteDialog(trip)}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Trip
              </button>
            </div>
          ))}
        </div>
      )}

      {tripToDelete && (
        <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog}>
          <div className="fixed inset-0 flex items-center justify-center z-10 bg-black bg-opacity-50">
            <Dialog.Panel className="bg-white p-6 rounded-lg max-w-sm w-full">
              <DialogTitle className="text-2xl font-bold text-center">
                Confirm Deletion
              </DialogTitle>
              <Description className="mt-2 text-center">
                Are you sure you want to delete this trip?
              </Description>
              <div className="mt-4 flex justify-around">
                <button
                  onClick={closeDeleteDialog}
                  className="px-6 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => tripToDelete && deleteTrip(tripToDelete._id)}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default MyTrips;
