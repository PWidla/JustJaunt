import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const TripDetailPage = () => {
  const { loggedInUser } = useAuth();
  const { tripId } = useParams<{ tripId: string }>();
  const [tripData, setTripData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!tripId) {
      return;
    }

    const fetchTripData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/trip/${tripId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch trip data");
        }

        const data = await response.json();
        console.log("fetchtripdata", data);

        if (data.trip.userId !== loggedInUser?.id) {
          console.log("unauthorized");
          navigate("/");
        }

        setTripData(data.trip);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTripData();
  }, [tripId, loggedInUser?.id, navigate]);

  if (isLoading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-start bg-gradient-to-r from-dark-green to-light-green text-white w-full min-h-screen pt-8 space-y-6 font-primaryRegular">
      <h1 className="text-3xl font-primaryBold text-center">
        {tripData?.name}
      </h1>
      <div className="text-center mx-4">
        <h2 className="text-xl font-primaryBold">Attractions</h2>
        <ul className="list-none space-y-2 mt-2">
          {tripData?.selectedAttractions?.map((attraction: any) => (
            <li
              key={attraction.entityId}
              className="bg-light-brown p-2 rounded-md shadow-lg"
            >
              {attraction.entityId}
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center mx-4">
        <h2 className="text-xl font-primaryBold">Hotels</h2>
        <ul className="list-none space-y-2 mt-2">
          {tripData?.selectedHotels?.map((hotel: any) => (
            <li
              key={hotel.entityId}
              className="bg-light-brown p-2 rounded-md shadow-lg"
            >
              {hotel.entityId}
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center mx-4">
        <h2 className="text-xl font-primaryBold">Food Places</h2>
        <ul className="list-none space-y-2 mt-2">
          {tripData?.selectedFoodPlaces?.map((foodPlace: any) => (
            <li
              key={foodPlace.entityId}
              className="bg-light-brown p-2 rounded-md shadow-lg"
            >
              {foodPlace.entityId}
            </li>
          ))}
        </ul>
      </div>

      {tripData && (
        <button
          type="button"
          className="mt-4 px-6 py-2 bg-gradient-to-r from-dark-brown to-light-brown text-white hover:text-dark-green rounded-3xl transition-colors duration-300 hover:font-primaryBold"
          onClick={() => navigate(`/trip/edit/${tripData._id}`)}
        >
          Edit Trip
        </button>
      )}
    </div>
  );
};

export default TripDetailPage;
