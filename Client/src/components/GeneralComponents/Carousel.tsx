import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import imgPlaceholder from "../../assets/images/imgPlaceholder.png";

interface Entity {
  entityId: string;
  name: string;
  description?: string;
  geoCode: { latitude: number; longitude: number };
  pictures?: string[];
}

interface CarouselProps {
  title: string;
  data: Entity[];
  type: "attraction" | "hotel" | "foodplace";
  onAssignToDay?: (entity: Entity, day: number | null, type: string) => void;
  onToggleHotel?: (hotel: Entity) => void;
  tripDays?: number;
}

const Carousel = ({
  title,
  data,
  type,
  onAssignToDay,
  onToggleHotel,
  tripDays,
}: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // no looping
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev < data.length - 1 ? prev + 1 : prev));
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="w-full my-8 flex flex-col items-center">
      <h2 className="text-2xl text-center font-semibold text-light-wheat mb-4">
        {title} ({data.length})
      </h2>

      {data.length > 0 && (
        <div className="relative w-full max-w-5xl flex items-center">
          {data.length > 1 && (
            <button
              className="absolute left-0 p-2 bg-gray-800 text-white rounded-full"
              onClick={prevSlide}
            >
              <FaChevronLeft className="w-6 h-6" />
            </button>
          )}

          <div className="w-full flex overflow-hidden justify-center">
            <div
              key={data[currentIndex].entityId}
              className="flex-none w-60 mx-2 cursor-pointer"
              onClick={() => setSelectedEntity(data[currentIndex])}
            >
              <div className="bg-light-brown p-4 rounded-xl shadow-xl space-y-4">
                <img
                  src={data[currentIndex].pictures?.[0] || imgPlaceholder}
                  alt={data[currentIndex].name}
                  className="w-full h-32 object-cover rounded-md"
                />
                <h3 className="text-xl font-bold text-dark-green">
                  {data[currentIndex].name}
                </h3>
              </div>
            </div>
          </div>

          {data.length > 1 && (
            <button
              className="absolute right-0 p-2 bg-gray-800 text-white rounded-full"
              onClick={nextSlide}
            >
              <FaChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}

      {selectedEntity && (
        <Dialog
          open={!!selectedEntity}
          onClose={() => setSelectedEntity(null)}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <DialogPanel className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full max-h-[70vh] overflow-y-auto">
            <DialogTitle className="text-xl font-bold">
              {selectedEntity.name}
            </DialogTitle>
            <img
              src={selectedEntity.pictures?.[0] || imgPlaceholder}
              alt={selectedEntity.name}
              className="w-full h-40 object-cover mt-2 rounded-md"
            />
            <p className="mt-2 text-sm">{selectedEntity.description}</p>
            <p className="mt-2 text-sm text-gray-600">
              Location: {selectedEntity.geoCode.latitude},{" "}
              {selectedEntity.geoCode.longitude}
            </p>

            <div className="flex justify-between mt-4">
              {onAssignToDay && (
                <div>
                  <label>Assign to Day:</label>
                  <select
                    value={selectedDay ?? ""}
                    onChange={(e) => setSelectedDay(Number(e.target.value))}
                    className="px-4 py-2 border rounded-lg"
                  >
                    <option value="">Select Day</option>
                    {[...Array(tripDays || 0)].map((_, index) => (
                      <option key={index} value={index + 1}>
                        Day {index + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
                    onClick={() =>
                      onAssignToDay(selectedEntity, selectedDay, type)
                    }
                  >
                    Assign
                  </button>
                </div>
              )}

              {onToggleHotel && type === "hotel" && (
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg"
                  onClick={() => onToggleHotel(selectedEntity)}
                >
                  Toggle Hotel
                </button>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-700 text-white rounded-lg"
                onClick={() => setSelectedEntity(null)}
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </Dialog>
      )}
    </div>
  );
};

export default Carousel;
