import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import Carousel from "../../components/GeneralComponents/Carousel"; // Upewnij się, że importujesz Carousel

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
      if (!tripId || !loggedInUser) return;

      try {
        const response = await fetch(`http://localhost:3000/trip/${tripId}`);
        if (!response.ok) throw new Error("Failed to fetch trip data");

        const data = await response.json();

        if (!loggedInUser) return navigate("/login");
        if (data.trip.userId !== loggedInUser?.id) return navigate("/");

        setTripData(data.trip);

        const fetchDetails = async (entityIds: string[], type: string) => {
          if (entityIds.length === 0) return [];
          const response = await fetch(
            `http://localhost:3000/${type}?ids=${entityIds.join(",")}`
          );
          if (!response.ok) throw new Error(`Failed to fetch ${type} data`);
          return await response.json();
        };

        const [attractions, hotels, foodplaces] = await Promise.all([
          fetchDetails(
            data.trip.selectedAttractions?.map((a: any) => a.entityId) || [],
            "attractions"
          ),
          fetchDetails(
            data.trip.selectedHotels?.map((h: any) => h.entityId) || [],
            "hotels"
          ),
          fetchDetails(
            data.trip.selectedFoodPlaces?.map((f: any) => f.entityId) || [],
            "foodplaces"
          ),
        ]);

        console.log(foodplaces);
        setAttractionsData(attractions);
        setHotelsData(hotels);
        setFoodPlacesData(foodplaces);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTripData();
  }, [tripId, loggedInUser, navigate]);

  if (isLoading)
    return <div className="text-center text-white">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  const handleAddToDay = (entity: any, type: string) => {
    console.log("Added to day:", entity, type);
  };

  const handleSelectHotel = (hotel: any) => {
    console.log("Selected hotel:", hotel);
  };

  const handleMoveToDay = (entity: any, day: number) => {
    console.log("Moved to day:", entity, day);
  };

  return (
    <div className="flex flex-col items-center justify-start bg-gradient-to-r from-dark-green to-light-green text-white w-full min-h-screen pt-8 space-y-6 font-primaryRegular">
      <h1 className="text-3xl font-primaryBold text-center">
        {tripData?.name}
      </h1>

      <Carousel
        title="Attractions"
        data={attractionsData}
        type="attraction"
        onAddToDay={handleAddToDay}
        onMoveToDay={handleMoveToDay}
      />

      <Carousel
        title="Hotels"
        data={hotelsData}
        type="hotel"
        onSelectHotel={handleSelectHotel}
      />

      <Carousel
        title="Food Places"
        data={foodPlacesData}
        type="foodplace"
        onAddToDay={handleAddToDay}
        onMoveToDay={handleMoveToDay}
      />

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
