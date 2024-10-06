import { useState } from "react";
import { AmadeusActivity } from "../../api/Amadeus";
import {
  BsFillArrowRightCircleFill,
  BsFillArrowLeftCircleFill,
} from "react-icons/bs";

interface HorizontalActivitiesListProps {
  activities: AmadeusActivity[];
}

const HorizontalActivitiesList = ({
  activities,
}: HorizontalActivitiesListProps) => {
  const filteredActivities = activities.filter(
    (activity) => activity.description
  );

  const [current, setCurrent] = useState(0);
  const [showMore, setShowMore] = useState(
    Array(filteredActivities.length).fill(false)
  );

  const toggleShowMore = (index: number) => {
    setShowMore((prev) => {
      const newShowMore = [...prev];
      newShowMore[index] = !newShowMore[index];
      return newShowMore;
    });
  };

  const truncateText = (text: string | undefined, index: number) => {
    if (!text) return "";
    return text.length < 100 || showMore[index]
      ? text
      : `${text.substring(0, 100)}...`;
  };

  const previousSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? filteredActivities.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrent((prev) =>
      prev === filteredActivities.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="relative overflow-hidden w-3/4 text-center mx-auto">
      {filteredActivities.length > 0 && (
        <h2 className="border-t-8 font-primaryBold text-4xl text-light-wheat text-center pt-10">
          Activities
        </h2>
      )}

      <div className="text-lg text-center mb-4">
        {current + 1}/{filteredActivities.length}
      </div>

      <div
        className="flex transition-transform duration-300 h-auto" // Użyj h-auto, aby wysokość była dostosowywana automatycznie
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {filteredActivities.map((activity, index) => (
          <div
            key={activity.id}
            className="flex-shrink-0 w-full flex flex-col items-center justify-start md:p-20"
          >
            <p className="font-primaryBold text-lg mb-4">{activity.name}</p>
            <div className="flex flex-col md:flex-row md:items-center md:justify-center">
              <div className="max-w-xs overflow-hidden text-ellipsis md:max-w-lg md:mr-4">
                <p className="text-sm md:text-base overflow-y-auto max-h-24 md:max-h-48 mb-4">
                  <span className="block md:hidden">
                    {truncateText(activity.description, index)}
                  </span>
                  {activity.description &&
                    activity.description.length > 100 && (
                      <span
                        onClick={() => toggleShowMore(index)}
                        className="text-light-brown cursor-pointer block md:hidden"
                      >
                        {showMore[index] ? "Show less" : "Show more"}
                      </span>
                    )}
                  <span className="hidden md:block">
                    {activity.description}
                  </span>
                </p>
              </div>
              <img
                src={`${activity.pictures}`}
                alt={`${activity.name} picture`}
                className="object-contain md:object-scale-down w-full h-auto max-h-96 mx-auto"
              />
            </div>

            {/* Przycisk nawigacyjny poniżej zdjęcia */}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalActivitiesList;
