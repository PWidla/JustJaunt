import { AmadeusActivity, AmadeusHotel } from "../../api/Amadeus";

interface CarouselProps {
  title: string;
  data: any[];
  type: "attraction" | "hotel" | "foodplace";
  onAddToDay?: (entity: AmadeusActivity, type: string) => void;
  onSelectHotel?: (hotel: AmadeusHotel) => void;
  onMoveToDay?: (entity: AmadeusActivity, day: number) => void;
}

const Carousel = ({
  title,
  data,
  type,
  onAddToDay,
  onSelectHotel,
  onMoveToDay,
}: CarouselProps) => {
  return (
    <div className="w-full my-8 flex flex-col items-center">
      <h2 className="text-2xl text-center font-semibold text-light-wheat mb-4">
        {title}
      </h2>
      <div className="w-full max-w-5xl flex overflow-x-auto gap-4 pb-4 justify-center">
        {data.map((entity: any) => (
          <div key={entity.entityId} className="flex-none w-60">
            <div className="bg-light-brown p-4 rounded-xl shadow-xl space-y-4">
              {type === "attraction" ||
              (type === "foodplace" && entity.pictures?.length) ? (
                <img
                  src={entity.pictures?.[0]} //moze placeholder jak nie ma
                  alt={entity.name}
                  className="w-full h-32 object-cover rounded-md"
                />
              ) : (
                <div className="bg-gray-300 h-32 flex items-center justify-center text-gray-700 rounded-md">
                  No Image
                </div>
              )}
              <h3 className="text-xl font-bold text-dark-green">
                {entity.name}
              </h3>
              {type === "attraction" && (
                <p className="text-sm text-dark-green">{entity.description}</p>
              )}
              <p className="text-sm text-dark-brown">
                Location: {entity.geoCode.latitude}, {entity.geoCode.longitude}
              </p>
              {onAddToDay && (
                <button
                  onClick={() => onAddToDay(entity, type)}
                  className="mt-2 px-6 py-2 bg-gradient-to-r from-dark-brown to-light-brown text-white rounded-lg shadow-md hover:opacity-80 transition-opacity duration-300"
                >
                  Add to Day
                </button>
              )}
              {onMoveToDay && (
                <button
                  onClick={() => onMoveToDay(entity, 1)}
                  className="mt-2 px-6 py-2 bg-gradient-to-r from-dark-brown to-light-brown text-white rounded-lg shadow-md hover:opacity-80 transition-opacity duration-300"
                >
                  Move to Day
                </button>
              )}
              {onSelectHotel && (
                <button
                  onClick={() => onSelectHotel(entity)}
                  className="mt-2 px-6 py-2 bg-gradient-to-r from-dark-brown to-light-brown text-white rounded-lg shadow-md hover:opacity-80 transition-opacity duration-300"
                >
                  Select Hotel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
