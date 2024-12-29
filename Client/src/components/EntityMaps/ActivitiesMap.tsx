import { AmadeusActivity, AmadeusLocation } from "../../api/Amadeus";
import MapView from "../Map/MapView";
import { useAttractions } from "../../context/AttractionsContext";
import { useFoodPlaces } from "../../context/FoodPlacesContext";

interface ActivitiesMapProps {
  activities: AmadeusActivity[];
  searchedCity: AmadeusLocation;
}

const ActivitiesMap = ({ activities, searchedCity }: ActivitiesMapProps) => {
  const attractionKeywords = [
    "museum",
    "park",
    "monument",
    "historic site",
    "art gallery",
    "zoo",
    "aquarium",
    "landmark",
    "amusement park",
    "observatory",
    "exhibition",
    "walk",
    "nature reserve",
    "building",
    "tour",
    "trail",
    "theater",
    "temple",
    "shop",
    "show",
    "tasting",
    "concert",
    "music",
    "cathedral",
    "castle",
    "church",
    "palace",
    "exhibit",
    "garden",
    "festival",
  ];

  const foodKeywords = [
    "restaurant",
    "cafeteria",
    "cafe",
    "coffee shop",
    "bar",
    "pub",
    "cuisine",
    "drink",
    "diner",
    "course",
    "food stall",
    "bistro",
    "dessert",
    "bakery",
    "brewery",
    "kitchen",
    "winery",
    "pizza",
    "pizzeria",
    "steakhouse",
    "tavern",
    "food court",
    "delicatessen",
    "buffet",
    "dining",
    "grill",
    "vegetarian",
    "vegan",
    "tapas",
    "lunch",
    "supper",
    "breakfast",
    "sushi",
  ];

  const attractions = activities.filter((activity) =>
    attractionKeywords.some(
      (keyword) =>
        activity.description?.toLowerCase().includes(keyword) ||
        activity.name?.toLowerCase().includes(keyword)
    )
  );

  const eatingPlaces = activities.filter((activity) =>
    foodKeywords.some(
      (keyword) =>
        activity.description?.toLowerCase().includes(keyword) ||
        activity.name?.toLowerCase().includes(keyword)
    )
  );

  const isSelected = (attractionId: string) => {
    return selectedAttractions.some(
      (attraction) => attraction.id === attractionId
    );
  };

  const { selectedAttractions, addAttraction, removeAttraction } =
    useAttractions();

  const handleAttractionInList = (attraction: AmadeusActivity) => {
    if (isSelected(attraction.id)) {
      removeAttraction(attraction.id);
    } else {
      addAttraction(attraction);
    }
    console.log("selectedAttractions");
    console.log(selectedAttractions);
  };

  const { selectedFoodPlaces, addFoodPlace, removeFoodPlace } = useFoodPlaces();

  const handleFoodPlaceInList = (foodPlace: AmadeusActivity) => {
    if (isSelected(foodPlace.id)) {
      removeFoodPlace(foodPlace.id);
    } else {
      addFoodPlace(foodPlace);
    }
    console.log("selectedFoodPlaces");
    console.log(selectedFoodPlaces);
  };

  return (
    <>
      <div className="border-t-8 flex flex-col justify-start items-center overflow-hidden w-5/6 h-screen mx-auto">
        {attractions.length > 0 && (
          <div className="mb-4">
            <h2 className="pt-10 font-primaryBold text-4xl text-light-wheat text-center md:pb-10">
              Attractions
            </h2>
            <span>
              You are able to select multiple attractions by clicking the pin
              you are interested in.
            </span>
          </div>
        )}

        {/* attractions map */}
        <div id="map" className="h-[70vh] w-full">
          <MapView
            markers={attractions}
            centerLocation={searchedCity}
            toggleMarkup={handleAttractionInList}
            isSelected={(attraction) =>
              selectedAttractions.some((a) => a.id === attraction.id)
            }
          />
        </div>
      </div>

      {/* eating places map */}
      <div className="border-t-8 flex flex-col justify-start items-center overflow-hidden w-5/6 h-screen mx-auto">
        {eatingPlaces.length > 0 && (
          <div className="mb-4">
            <h2 className="pt-10 font-primaryBold text-4xl text-light-wheat text-center md:pb-10">
              Eating places
            </h2>
            <span>
              You are able to select multiple eating places by clicking the pin
              you are interested in.
            </span>
          </div>
        )}

        <div id="map" className="h-[70vh] w-full">
          <MapView
            markers={eatingPlaces}
            centerLocation={searchedCity}
            toggleMarkup={handleFoodPlaceInList}
            isSelected={(foodPlace) =>
              selectedFoodPlaces.some((a) => a.id === foodPlace.id)
            }
          />
        </div>
      </div>
    </>
  );
};

export default ActivitiesMap;
