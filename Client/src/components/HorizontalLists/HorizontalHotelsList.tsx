import { useState } from "react";
import { AmadeusHotel } from "../../api/Amadeus";
import {
  BsFillArrowRightCircleFill,
  BsFillArrowLeftCircleFill,
} from "react-icons/bs";

interface HorizontalHotelsListProps {
  hotels: AmadeusHotel[];
}

const HorizontalHotelsList = ({ hotels }: HorizontalHotelsListProps) => {
  const [current, setCurrent] = useState(0);

  const previousSlide = () => {
    setCurrent((prev) => (prev === 0 ? hotels.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === hotels.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative overflow-hidden w-3/4 text-center mx-auto">
      {hotels.length > 0 && (
        <h2 className="border-t-8 font-primaryBold text-4xl text-light-wheat text-center pt-10">
          Hotels
        </h2>
      )}

      <div className="text-lg text-center mb-4">
        {current + 1}/{hotels.length}
      </div>

      <div
        className="flex transition-transform duration-300 h-auto"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {hotels.map((hotel, index) => (
          <div
            key={hotel.dupeId}
            className="flex-shrink-0 w-full flex flex-col items-center justify-start md:p-20"
          >
            <p className="font-primaryBold text-lg mb-4">{hotel.name}</p>
            <div className="flex flex-col md:flex-row md:items-center md:justify-center">
              <div className="max-w-xs overflow-hidden text-ellipsis md:max-w-lg md:mr-4">
                <p className="text-sm md:text-base overflow-y-auto max-h-24 md:max-h-48 mb-4"></p>
              </div>
            </div>

            <div className="flex justify-between w-full mt-4">
              <div
                className="text-white text-3xl p-2 cursor-pointer"
                onClick={previousSlide}
              >
                <BsFillArrowLeftCircleFill />
              </div>
              <div
                className="text-white text-3xl p-2 cursor-pointer"
                onClick={nextSlide}
              >
                <BsFillArrowRightCircleFill />
              </div>
            </div>

            <div>
              Map
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalHotelsList;
