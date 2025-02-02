import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const TripDetailPage = () => {
  const { loggedInUser } = useAuth();
  const { tripId } = useParams<{ tripId: string }>();
  const [tripData, setTripData] = useState<any>(null);
  const [attractionsData, setAttractionsData] = useState<any[]>([]);
  const [hotelsData, setHotelsData] = useState<any[]>([]);
  const [foodPlacesData, setFoodPlacesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!tripId) return;

    const fetchTripData = async () => {
      if (!tripId || !loggedInUser) return; // Nie wykonuj, jeśli brakuje danych trip lub użytkownika

      try {
        const response = await fetch(`http://localhost:3000/trip/${tripId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch trip data");
        }
        const data = await response.json();
        console.log("loggedInUser?.id");
        console.log(loggedInUser?.id);
        console.log("data.trip.userId");
        console.log(data.trip.userId);

        if (!loggedInUser) {
          console.log("User not logged in");
          return navigate("/login");
        }

        if (data.trip.userId !== loggedInUser?.id) {
          console.log("unauthorized");
          navigate("/");
        }

        setTripData(data.trip);

        // Funkcja do pobrania danych z backendu dla wielu entityIds
        const fetchDetails = async (entityIds: string[], type: string) => {
          const idsParam = entityIds.join(","); // Łączenie ID w jeden string
          const response = await fetch(
            `http://localhost:3000/${type}?ids=${idsParam}`
          );

          if (!response.ok) {
            throw new Error(`Failed to fetch ${type} data`);
          }

          const data = await response.json();
          return data;
        };

        if (data.trip.selectedAttractions) {
          const attractions = await fetchDetails(
            data.trip.selectedAttractions.map(
              (attraction: any) => attraction.entityId
            ),
            "attractions"
          );
          setAttractionsData(attractions);
        }

        if (data.trip.selectedHotels) {
          const hotels = await fetchDetails(
            data.trip.selectedHotels.map((hotel: any) => hotel.entityId),
            "hotels"
          );
          setHotelsData(hotels);
        }

        if (data.trip.selectedFoodPlaces) {
          const foodPlaces = await fetchDetails(
            data.trip.selectedFoodPlaces.map(
              (foodPlace: any) => foodPlace.entityId
            ),
            "foodplaces"
          );
          setFoodPlacesData(foodPlaces);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTripData();
  }, [tripId, loggedInUser, navigate]);

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
          {attractionsData.map((attraction: any) => (
            <li
              key={attraction.entityId}
              className="bg-light-brown p-2 rounded-md shadow-lg"
            >
              <h3>{attraction.name}</h3>
              <p>{attraction.description}</p>
              <p>{attraction.location}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center mx-4">
        <h2 className="text-xl font-primaryBold">Hotels</h2>
        <ul className="list-none space-y-2 mt-2">
          {hotelsData.map((hotel: any) => (
            <li
              key={hotel.entityId}
              className="bg-light-brown p-2 rounded-md shadow-lg"
            >
              <h3>{hotel.name}</h3>
              <p>{hotel.address}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center mx-4">
        <h2 className="text-xl font-primaryBold">Food Places</h2>
        <ul className="list-none space-y-2 mt-2">
          {foodPlacesData.map((foodPlace: any) => (
            <li
              key={foodPlace.entityId}
              className="bg-light-brown p-2 rounded-md shadow-lg"
            >
              <h3>{foodPlace.name}</h3>
              <p>{foodPlace.description}</p>
              <p>{foodPlace.cuisine}</p>
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
