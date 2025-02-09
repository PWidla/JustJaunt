import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import Carousel from "../../components/GeneralComponents/Carousel";
import { IAttraction } from "../../../../Server/src/models/attraction";
import { IHotel } from "../../../../Server/src/models/hotel";
import { IFoodPlace } from "../../../../Server/src/models/foodPlace";

const TripDetailPage = () => {
  interface IPlannedAttraction extends IAttraction {
    day: number | null;
  }

  interface IPlannedHotel extends IHotel {
    isChosen: boolean;
  }

  interface IPlannedFoodPlace extends IFoodPlace {
    day: number | null;
  }

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

        const plannedAttractions: IPlannedAttraction[] = attractions.map(
          (attraction: IAttraction) => {
            const tripAttraction = data.trip.selectedAttractions.find(
              (item: IAttraction) => item.entityId === attraction.entityId
            );
            return { ...attraction, day: tripAttraction?.day || null };
          }
        );

        const plannedHotels: IPlannedHotel[] = hotels.map((hotel: IHotel) => {
          const tripHotel = data.trip.selectedHotels.find(
            (item: IHotel) => item.entityId === hotel.entityId
          );
          return { ...hotel, isChosen: tripHotel?.isChosen || false };
        });

        const plannedFoodPlaces: IPlannedFoodPlace[] = foodplaces.map(
          (foodplace: IFoodPlace) => {
            const tripFoodPlace = data.trip.selectedFoodPlaces.find(
              (item: IFoodPlace) => item.entityId === foodplace.entityId
            );
            return { ...foodplace, day: tripFoodPlace?.day || null };
          }
        );

        setAttractionsData(plannedAttractions);
        setHotelsData(plannedHotels);
        setFoodPlacesData(plannedFoodPlaces);
        console.log("plannedAttractions", plannedAttractions);
        console.log("plannedHotels", plannedHotels);
        console.log("plannedFoodPlaces", plannedFoodPlaces);
        console.log("data.trip", data.trip);
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

  const handleAssignToDay = (entity: any, day: number | null, type: string) => {
    console.log("Assigned to day:", entity, day, type);
    //
  };

  const handleToggleHotel = (hotel: any) => {
    console.log("Toggled hotel:", hotel);
    //
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
        onAssignToDay={handleAssignToDay}
        tripDays={tripData?.days || 0}
      />

      <Carousel
        title="Hotels"
        data={hotelsData}
        type="hotel"
        onToggleHotel={handleToggleHotel}
      />

      <Carousel
        title="Food Places"
        data={foodPlacesData}
        type="foodplace"
        onAssignToDay={handleAssignToDay}
        tripDays={tripData?.days || 0}
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
