import { useRef, useState } from "react";
import {
  AmadeusLocation,
  getActivities,
  getHotels,
  getLocations,
} from "../../api/Amadeus";

const PlanTripPage = () => {
  const [inputValue, setInputValue] = useState("");
  const cityInputRef = useRef<HTMLInputElement>(null);

  const fetchActivities = async (city: AmadeusLocation) => {
    try {
      const activities = await getActivities(city);
      return activities;
    } catch (error) {
      console.error("Error fetching activities:", error);
      return null;
    }
  };

  const fetchHotels = async (city: AmadeusLocation) => {
    try {
      const hotels = await getHotels(city);
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
        const city: AmadeusLocation = locations[0];

        const [activities, hotels] = await Promise.all([
          fetchActivities(city),
          fetchHotels(city),
        ]);

        if (activities) {
          //
        } else {
          console.error("Failed to fetch activities.");
        }

        if (hotels) {
          //
        } else {
          console.error("Failed to fetch hotels.");
        }
      } else {
        console.error(
          `We couldn't find data for city '${cityInput}'. Please make sure it's correct and try again.`
        );
      }
    }

    setInputValue("");
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-r from-dark-green to-light-green text-white w-full min-h-screen space-y-8 p-8 font-primaryRegular">
      <span className="font-primaryRegular text-center">
        Tell us the name of the city you plan to visit
      </span>
      <input
        type="text"
        name="city-input"
        id="city-input"
        placeholder="Enter the city name"
        className="text-center text-black"
        ref={cityInputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        type="button"
        className="mt-6 px-3 py-2 bg-gradient-to-r from-dark-brown to-light-brown text-white hover:text-dark-green rounded-3xl transition-colors duration-300 hover:font-primaryBold"
        onClick={handleSearchCity}
      >
        Search
      </button>
    </div>
  );
};

export default PlanTripPage;
