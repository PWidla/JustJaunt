import { AmadeusHotel, AmadeusLocation } from "../../api/Amadeus";
import { useAppStore } from "../../stores/useAppStore";
import MapView from "../Map/MapView";

interface HotelsMapProps {
  hotels: AmadeusHotel[];
  searchedCity: AmadeusLocation;
}

const HotelsMap = ({ hotels, searchedCity }: HotelsMapProps) => {
  const isHotelSelected = (hotel: AmadeusHotel) => {
    return selectedHotels.some(
      (selectedHotel) => selectedHotel.dupeId === hotel.dupeId
    );
  };

  const selectedHotels = useAppStore((state) => state.selectedHotels);
  const addHotel = useAppStore((state) => state.addHotel);
  const removeHotel = useAppStore((state) => state.removeHotel);

  const handleHotelInList = (hotel: AmadeusHotel) => {
    console.log("selectedHotels");
    console.log(selectedHotels);
    if (isHotelSelected(hotel)) {
      removeHotel(hotel.dupeId);
    } else {
      addHotel(hotel);
    }
  };

  return (
    <div className="border-t-8 flex flex-col justify-start items-center overflow-hidden w-5/6 h-screen mx-auto">
      {hotels.length > 0 && (
        <div className="mb-4">
          <h2 className="pt-10 font-primaryBold text-4xl text-light-wheat text-center md:pb-10">
            Hotels
          </h2>
          <span>
            You are able to select one hotel by clicking the pin you are
            interested in.
          </span>
        </div>
      )}

      <div id="map" className="h-[70vh] w-full">
        <MapView
          markers={hotels}
          centerLocation={searchedCity}
          toggleMarkup={handleHotelInList}
          isSelected={isHotelSelected}
        ></MapView>
      </div>
    </div>
  );
};

export default HotelsMap;
