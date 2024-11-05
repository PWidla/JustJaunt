import { useRef, useState } from "react";
import {
  AmadeusActivity,
  AmadeusHotel,
  AmadeusLocation,
  getActivities,
  getHotels,
  getLocations,
} from "../../api/Amadeus";
import HorizontalActivitiesList from "../../components/HorizontalLists/HorizontalActivitiesList";
import HorizontalHotelsList from "../../components/HorizontalLists/HorizontalHotelsList";

const PlanTripPage = () => {
  const [activities, setActivities] = useState<AmadeusActivity[]>([]);
  const [hotels, setHotels] = useState<AmadeusHotel[]>([]);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const [searchedCity, setSearchedCity] = useState<AmadeusLocation | null>(
    null
  );

  const fetchActivities = async (city: AmadeusLocation) => {
    try {
      const activities = await getActivities(city);
      console.log(activities);
      return activities;
    } catch (error) {
      console.error("Error fetching activities:", error);
      return null;
    }
  };

  const fetchHotels = async (city: AmadeusLocation) => {
    try {
      const hotels = await getHotels(city);
      console.log(hotels);
      return hotels;
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

        const [fetchedActivities, fetchedHotels] = await Promise.all([
          fetchActivities(city),
          fetchHotels(city),
        ]);

        if (fetchedActivities) {
          setActivities(fetchedActivities);
        } else {
          console.error("Failed to fetch activities.");
        }

        if (fetchedHotels) {
          setHotels(fetchedHotels);
        } else {
          console.error("Failed to fetch hotels.");
        }
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
        <HorizontalActivitiesList
          activities={activities}
          searchedCity={searchedCity!}
        />
      )}

      {hotels.length > 0 && (
        <HorizontalHotelsList hotels={hotels} searchedCity={searchedCity!} />
      )}
    </div>
  );
};

export default PlanTripPage;
