import { useState } from "react";
import { AmadeusActivity } from "../../../api/Amadeus";

interface HorizontalActivitiesListProps {
  activities: AmadeusActivity[];
}

const HorizontalActivitiesList = ({
  activities,
}: HorizontalActivitiesListProps) => {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const truncateText = (text: string | undefined) => {
    if (!text) return "";
    return text.length < 100 || showMore
      ? text
      : `${text.substring(0, 100)}...`;
  };

  return (
    //moze wyswietlaj tylko activities ktore maja description, chyba ze length takich mniejsze niz 20 to wtedy all? albo cos
    //tworzyc tutaj kolekcje divow do dodawania, i je przekazywac do generic componentu przewijaka
    <div className="flex flex-col items-center justify-center font-primaryRegular text-center">
      {activities.map((activity, index) => (
        <div key={activity.id} className="space-y-6 w-8/12">
          <p className="font-primaryBold">{activity.name}</p>
          <p>
            <span className="block md:hidden">
              {truncateText(activity.description)}
            </span>

            {activity.description && activity.description.length > 100 && (
              <span
                onClick={toggleShowMore}
                className="text-light-brown cursor-pointer block md:hidden"
              >
                {showMore ? "Show less" : "Show more"}
              </span>
            )}
            <span className="hidden md:block">{activity.description}</span>
          </p>
          <img
            src={`${activity.pictures}`}
            alt={`${activity.name} picture`}
            className="object-contain md:object-scale-down w-full h-auto max-h-96"
          />
        </div>
      ))}
    </div>
  );
};

export default HorizontalActivitiesList;
