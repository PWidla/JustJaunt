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
    <div className="relative overflow-hidden w-3/4 text-center">
      {filteredActivities.length > 0 && (
        <>
          <h2 className="border-t-8 font-primaryBold text-4xl text-light-wheat text-center pt-10">
            Activities
          </h2>
        </>
      )}

      <div
        className="flex transition-transform duration-300 h-dvh"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {filteredActivities.map((activity, index) => (
          <div
            key={activity.id}
            className="flex-shrink-0 w-full flex flex-col items-center justify-center p-2"
          >
            <p className="font-primaryBold text-lg">{activity.name}</p>
            <div className="max-w-xs overflow-hidden text-ellipsis md:max-w-lg">
              <p className="text-sm md:text-base">
                <span className="block md:hidden">
                  {truncateText(activity.description, index)}
                </span>
                {activity.description && activity.description.length > 100 && (
                  <span
                    onClick={() => toggleShowMore(index)}
                    className="text-light-brown cursor-pointer block md:hidden"
                  >
                    {showMore[index] ? "Show less" : "Show more"}
                  </span>
                )}
                <span className="hidden md:block">{activity.description}</span>
              </p>
            </div>
            <img
              src={`${activity.pictures}`}
              alt={`${activity.name} picture`}
              className="object-contain md:object-scale-down w-full h-auto max-h-96"
            />
          </div>
        ))}
      </div>

      {filteredActivities.length > 0 && (
        <>
          <div
            className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-3xl p-2 z-10 cursor-pointer"
            onClick={previousSlide}
          >
            <BsFillArrowLeftCircleFill />
          </div>
          <div
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-3xl p-2 z-10 cursor-pointer"
            onClick={nextSlide}
          >
            <BsFillArrowRightCircleFill />
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-lg">
            {current + 1}/{filteredActivities.length}
          </div>
        </>
      )}
    </div>
  );
};

export default HorizontalActivitiesList;
