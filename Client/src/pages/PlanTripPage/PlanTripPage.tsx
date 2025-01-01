import { useRef, useState } from "react";
import {
  AmadeusActivity,
  AmadeusHotel,
  AmadeusLocation,
  getActivities,
  getHotels,
  getLocations,
  getMockActivities,
  getMockHotels,
  getMockLocations,
} from "../../api/Amadeus";
import ActivitiesMap from "../../components/EntityMaps/ActivitiesMap";
import HotelsMap from "../../components/EntityMaps/HotelsMap";
import { useHotels } from "../../context/HotelsContext";
import { useAttractions } from "../../context/AttractionsContext";
import { useFoodPlaces } from "../../context/FoodPlacesContext";

const PlanTripPage = () => {
  const [activities, setActivities] = useState<AmadeusActivity[]>([]);
  const [hotels, setHotels] = useState<AmadeusHotel[]>([]);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const [searchedCity, setSearchedCity] = useState<AmadeusLocation | null>(
    null
  );

  const { selectedHotels } = useHotels();
  const { selectedAttractions } = useAttractions();
  const { selectedFoodPlaces } = useFoodPlaces();

  const locationMock = getMockLocations();

  const fetchActivities = async (city: AmadeusLocation) => {
    try {
      const { activities, isMock: isActivitiesMock } =
        await getActivities(city);
      console.log(city);
      console.log(activities);
      return { activities, isMock: isActivitiesMock };
    } catch (error) {
      console.error("Error fetching activities:", error);
      return null;
    }
  };

  const fetchHotels = async (city: AmadeusLocation) => {
    try {
      const { hotels, isMock: isHotelsMock } = await getHotels(city);

      console.log(hotels);
      return { hotels, isMock: isHotelsMock };
    } catch (error) {
      console.error("Error fetching hotels:", error);
      return null;
    }
  };

  const handleSearchCity = async () => {
    if (!cityInputRef.current || cityInputRef.current.value.trim() === "") {
      console.error("Please provide the city name.");
    } else {
      const cityInput = cityInputRef.current.value;
      const locations: AmadeusLocation[] | null = await getLocations(cityInput);

      if (locations && locations.length > 0) {
        const city = locations[0];
        setSearchedCity(city);

        const [activitiesResult, hotelsResult] = await Promise.all([
          fetchActivities(city),
          fetchHotels(city),
        ]);

        if (activitiesResult?.isMock || hotelsResult?.isMock) {
          activitiesResult!.activities = getMockActivities();
          hotelsResult!.hotels = getMockHotels();
          setSearchedCity(locationMock[0]);
        }

        setActivities(activitiesResult!.activities);
        setHotels(hotelsResult!.hotels);
      } else {
        console.error(
          `We couldn't find data for city '${cityInput}'. Please make sure it's correct and try again.`
        );
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-start bg-gradient-to-r from-dark-green to-light-green text-white w-full min-h-screen space-y-4 pt-8 font-primaryRegular">
      <span className="font-primaryRegular text-center">
        Tell us the name of the city you plan to visit
      </span>
      <input
        type="text"
        name="city-input"
        id="city-input"
        placeholder="Enter the city name"
        className="text-center text-black rounded-md p-2"
        ref={cityInputRef}
      />
      <button
        type="button"
        className="mt-2 px-3 py-2 bg-gradient-to-r from-dark-brown to-light-brown text-white hover:text-dark-green rounded-3xl transition-colors duration-300 hover:font-primaryBold"
        onClick={handleSearchCity}
      >
        Search
      </button>

      {activities.length > 0 ||
        (hotels.length > 0 && (
          <div>
            <div className="w-5/6 text-center text-light-wheat mx-auto">
              <h1 className="font-primaryBold text-xl">
                {/* refact */}
                {cityInputRef.current?.value || ""}
              </h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi
                earum sequi quaerat aliquid sunt voluptatum corrupti nobis quod
                temporibus obcaecati, enim officia asperiores dolore vero quo
                sapiente ab! Totam, rem.
              </p>
            </div>
          </div>
        ))}

      {activities.length > 0 && (
        <ActivitiesMap activities={activities} searchedCity={searchedCity!} />
      )}

      {hotels.length > 0 && (
        <HotelsMap hotels={hotels} searchedCity={searchedCity!} />
      )}

      <div className="flex flex-col items-center justify-start text-white w-full">
        {activities.length > 0 && hotels.length > 0 ? (
          selectedAttractions.length > 2 &&
          selectedFoodPlaces.length > 2 &&
          selectedHotels.length > 0 ? (
            <button
              type="button"
              className="mt-2 px-3 py-2 bg-gradient-to-r from-dark-brown to-light-brown text-white hover:text-dark-green rounded-3xl transition-colors duration-300 hover:font-primaryBold"
              // onClick={handleSearchCity}
            >
              Search
            </button>
          ) : (
            <p className="text-center font-primaryBold md:text-3xl pb-20">
              Please select at least 3 attractions, 3 food places, and 1 hotel
              to proceed.
            </p>
          )
        ) : null}
      </div>
    </div>
  );
};

export default PlanTripPage;
