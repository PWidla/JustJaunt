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
  const [isShared, setIsShared] = useState(false);
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
    if (!tripId) {
      navigate("/");
      return;
    }
    // if (!loggedInUser) {
    //   navigate("/login");
    //   return;
    // }

    const fetchTripData = async () => {
      if (!tripId || !loggedInUser) return;

      try {
        const userIdParam = loggedInUser ? `&userId=${loggedInUser.id}` : "";
        const response = await fetch(
          `http://localhost:3000/trip/${tripId}?${userIdParam}`
        );
        // const response = await fetch(`http://localhost:3000/trip/${tripId}`);
        if (!response.ok) throw new Error("Failed to fetch trip data");

        const data = await response.json();

        if (!loggedInUser) return navigate("/login");
        if (!data.trip.isShared && loggedInUser?.id !== data.trip.userId) {
          return navigate("/");
        }

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

  const saveUpdatedTrip = async () => {
    if (!tripData || !loggedInUser) return;

    if (tripData.userId !== loggedInUser.id) {
      console.warn("Unauthorized: You are not the owner of this trip.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/trip/save-with-days",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tripId: tripData._id,
            userId: tripData.userId,
            isShared: tripData.isShared,
            selectedAttractions: tripData.selectedAttractions,
            selectedHotels: tripData.selectedHotels,
            selectedFoodPlaces: tripData.selectedFoodPlaces,
            days: tripData.days,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save trip");
      }

      const data = await response.json();
      console.log("Trip saved:", data);
    } catch (error) {
      console.error("Error saving trip:", error);
    }
  };

  const filterEntitiesForDay = (
    day: number,
    entities: (IPlannedAttraction | IPlannedFoodPlace)[]
  ): (IPlannedAttraction | IPlannedFoodPlace)[] => {
    return entities.filter((entity) => entity.day === day);
  };

  const filterUnassignedEntities = (
    entities: (IPlannedAttraction | IPlannedFoodPlace | IPlannedHotel)[],
    type: "attraction" | "foodplace" | "hotel"
  ): (IPlannedAttraction | IPlannedFoodPlace | IPlannedHotel)[] => {
    if (type === "attraction" || type === "foodplace") {
      return entities.filter(
        (entity) =>
          (entity as IPlannedAttraction | IPlannedFoodPlace).day === null
      );
    } else if (type === "hotel") {
      return entities.filter(
        (entity) => (entity as IPlannedHotel).isChosen === false
      );
    }
    return [];
  };

  const handleToggleHotel = (hotel: IPlannedHotel) => {
    const updatedData = { ...tripData };

    const shouldDeselect = hotel.isChosen;

    updatedData.selectedHotels = updatedData.selectedHotels.map(
      (item: IPlannedHotel) => ({
        ...JSON.parse(JSON.stringify(item)),
        isChosen: shouldDeselect ? false : item.entityId === hotel.entityId,
      })
    );

    setHotelsData((prevData: IPlannedHotel[]) =>
      prevData.map((item: IPlannedHotel) => ({
        ...JSON.parse(JSON.stringify(item)),
        isChosen: shouldDeselect ? false : item.entityId === hotel.entityId,
      }))
    );

    setTripData(updatedData);
    console.log("hotel updatedData", updatedData);
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

    setTripData(updatedData);
    console.log("updatedData", updatedData);
  };

  const copyTripLink = () => {
    const tripLink = `${window.location.origin}/trip/${tripId}`;
    navigator.clipboard.writeText(tripLink);
    alert("Trip link copied!");
  };

  const toggleShareTrip = () => {
    console.log("toggleShareTrip");
    setIsShared(!isShared);

    const updatedData = { ...tripData };
    updatedData.isShared = isShared;
    setTripData(updatedData);
    console.log("updatedData", updatedData);

    console.log("toggleShareTrip end");
  };

  return (
    <div className="flex flex-col items-center justify-start bg-gradient-to-r from-dark-green to-light-green text-white w-full min-h-screen pt-8 space-y-6 font-primaryRegular">
      <h1 className="text-3xl font-primaryBold text-center text-light-wheat">
        {tripData?.name}
      </h1>

      {tripData?.isShared && (
        <button
          className="px-4 py-2 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 transition"
          onClick={copyTripLink}
        >
          Copy Trip Link
        </button>
      )}

      <button
        className={`px-4 py-2 rounded-lg shadow-md transition ${
          tripData?.isShared
            ? "bg-red-600 hover:bg-red-500"
            : "bg-green-600 hover:bg-green-500"
        }`}
        onClick={toggleShareTrip}
      >
        {tripData?.isShared ? "Disable Sharing" : "Enable Sharing"}
      </button>

      <Carousel
        title="Hotels - Unassigned"
        data={hotelsData.filter((hotel) => !hotel.isChosen)}
        type="hotel"
        onToggleHotel={handleToggleHotel}
      />

      <Carousel
        title="Attractions - Unassigned"
        data={filterUnassignedEntities(attractionsData, "attraction")}
        type="attraction"
        onAssignToDay={handleAssignToDay}
        tripDays={tripData?.days || 0}
      />

      <Carousel
        title="Food Places - Unassigned"
        data={filterUnassignedEntities(foodPlacesData, "foodplace")}
        type="foodplace"
        onAssignToDay={handleAssignToDay}
        tripDays={tripData?.days || 0}
      />

      {hotelsData.some((hotel) => hotel.isChosen) && (
        <div className="w-full space-y-6">
          <div className="bg-green-950 p-4 rounded-lg shadow-lg text-white text-xl font-semibold border-t-4 border-dark-green">
            <Carousel
              title="Selected Hotel"
              data={hotelsData.filter((hotel) => hotel.isChosen)}
              type="hotel"
              onToggleHotel={handleToggleHotel}
            />
          </div>
        </div>
      )}

      {Array.from({ length: tripData?.days }, (_, day) => {
        const attractionsForDay = filterEntitiesForDay(
          day + 1,
          attractionsData
        );
        const foodplacesForDay = filterEntitiesForDay(day + 1, foodPlacesData);

        if (attractionsForDay.length === 0 && foodplacesForDay.length === 0) {
          return null;
        }

        return (
          <div key={day} className="w-full space-y-6">
            <div className="bg-green-950 p-4 rounded-lg shadow-lg text-white text-xl font-semibold border-t-4 border-dark-green">
              <div className="text-center mb-4 text-light-wheat">
                {`Day ${day + 1}`}
              </div>

              <Carousel
                title={`Day ${day + 1} - Attractions`}
                data={attractionsForDay}
                type="attraction"
                onAssignToDay={handleAssignToDay}
                tripDays={tripData?.days || 0}
              />

              <Carousel
                title={`Day ${day + 1} - Food Places`}
                data={foodplacesForDay}
                type="foodplace"
                onAssignToDay={handleAssignToDay}
                tripDays={tripData?.days || 0}
              />
            </div>
          </div>
        );
      })}

      {tripData && (
        <button
          type="button"
          className="mt-4 px-6 py-2 bg-gradient-to-r from-dark-green to-light-green text-white rounded-full font-primaryBold"
          onClick={saveUpdatedTrip}
        >
          Save
        </button>
      )}
    </div>
  );
};

export default TripDetailPage;
