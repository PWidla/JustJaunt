import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import Carousel from "../../components/GeneralComponents/Carousel";
import { IAttraction } from "../../../../Server/src/models/attraction";
import { IHotel } from "../../../../Server/src/models/hotel";
import { IFoodPlace } from "../../../../Server/src/models/foodPlace";

export interface IPlannedAttraction extends IAttraction {
  day: number | null;
}

export interface IPlannedHotel extends IHotel {
  isChosen: boolean;
}

export interface IPlannedFoodPlace extends IFoodPlace {
  day: number | null;
}
const TripDetailPage = () => {
  const { loggedInUser } = useAuth();
  const { tripId } = useParams<{ tripId: string }>();
  const [tripData, setTripData] = useState<any>(null);
  const [attractionsData, setAttractionsData] = useState<IPlannedAttraction[]>(
    []
  );
  const [hotelsData, setHotelsData] = useState<IPlannedHotel[]>([]);
  const [foodPlacesData, setFoodPlacesData] = useState<IPlannedFoodPlace[]>([]);
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

  const updateTripData = (updatedData: any) => {
    setTripData((prevData: any) => ({
      ...prevData,
      selectedAttractions:
        updatedData.attractions || prevData.selectedAttractions,
      selectedFoodPlaces: updatedData.foodPlaces || prevData.selectedFoodPlaces,
      selectedHotels: updatedData.hotels || prevData.selectedHotels,
    }));

    console.log("updatedData", updatedData);
  };

  const handleAssignToDay = (
    entity: IPlannedAttraction | IPlannedFoodPlace,
    day: number | null,
    type: string
  ) => {
    const updatedData = { ...tripData };

    if (type === "attraction") {
      updatedData.selectedAttractions = updatedData.selectedAttractions.map(
        (item: any) =>
          item.entityId === entity.entityId ? { ...item, day } : item
      );

      setAttractionsData((prevData: any) =>
        prevData.map((item: any) =>
          item.entityId === entity.entityId ? { ...item, day } : item
        )
      );
    } else if (type === "foodplace") {
      updatedData.selectedFoodPlaces = updatedData.selectedFoodPlaces.map(
        (item: any) =>
          item.entityId === entity.entityId ? { ...item, day } : item
      );

      setFoodPlacesData((prevData: any) =>
        prevData.map((item: any) =>
          item.entityId === entity.entityId ? { ...item, day } : item
        )
      );
    }

    updateTripData(updatedData);
  };

  const handleToggleHotel = (hotel: IPlannedHotel) => {
    const updatedData = { ...tripData };

    updatedData.selectedHotels = updatedData.selectedHotels.map(
      (item: IHotel) =>
        item.entityId === hotel.entityId
          ? { ...item, isChosen: !hotel.isChosen }
          : item
    );

    updateTripData(updatedData);
  };

  const filterEntitiesForCarousel = (
    entities: (IPlannedAttraction | IPlannedFoodPlace | IPlannedHotel)[],
    type: "attraction" | "foodplace" | "hotel"
  ): (IPlannedAttraction | IPlannedFoodPlace | IPlannedHotel)[] => {
    if (type === "attraction" || type === "foodplace") {
      return entities.filter(
        (entity) =>
          // (entity as IPlannedAttraction | IPlannedFoodPlace).day === day ||
          (entity as IPlannedAttraction | IPlannedFoodPlace).day === null
      );
    } else if (type === "hotel") {
      return entities.filter(
        (entity) => (entity as IPlannedHotel).isChosen === false
      );
    }
    return [];
  };

  return (
    <div className="flex flex-col items-center justify-start bg-gradient-to-r from-dark-green to-light-green text-white w-full min-h-screen pt-8 space-y-6 font-primaryRegular">
      <h1 className="text-3xl font-primaryBold text-center">
        {tripData?.name}
      </h1>

      <Carousel
        title="Attractions - not assigned to any day"
        data={filterEntitiesForCarousel(attractionsData, "attraction")}
        type="attraction"
        onAssignToDay={handleAssignToDay}
        tripDays={tripData?.days || 0}
      />

      <Carousel
        title="Food Places - not assigned to any day"
        data={filterEntitiesForCarousel(foodPlacesData, "foodplace")}
        type="foodplace"
        onAssignToDay={handleAssignToDay}
        tripDays={tripData?.days || 0}
      />

      <Carousel
        title="Hotels - not assigned"
        data={filterEntitiesForCarousel(hotelsData, "hotel")}
        type="hotel"
        onToggleHotel={handleToggleHotel}
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
