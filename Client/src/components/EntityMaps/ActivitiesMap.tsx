import { useMemo } from "react";
import { AmadeusActivity, AmadeusLocation } from "../../api/Amadeus";
import MapView from "../Map/MapView";

interface ActivitiesMapProps {
  activities: AmadeusActivity[];
  searchedCity: AmadeusLocation;
}

const ActivitiesMap = ({ activities, searchedCity }: ActivitiesMapProps) => {
  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => activity.description);
  }, [activities]);

  return (
    <div className="border-t-8 flex flex-col justify-start items-center overflow-hidden w-5/6 h-screen mx-auto">
      {filteredActivities.length > 0 && (
        <div className="mb-4">
          <h2 className="pt-10 font-primaryBold text-4xl text-light-wheat text-center md:pb-10">
            Activities
          </h2>
          <span>
            You are able to select multiple activities by clicking the pin you
            are interested in.
          </span>
        </div>
      )}

      <div id="map" className="h-[70vh] w-full">
        <MapView
          markers={filteredActivities} //activities
          centerLocation={searchedCity}
        ></MapView>{" "}
      </div>
    </div>
  );
};

export default ActivitiesMap;
