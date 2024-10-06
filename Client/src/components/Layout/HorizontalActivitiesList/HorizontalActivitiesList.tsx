import { AmadeusActivity } from "../../../api/Amadeus";

interface HorizontalActivitiesListProps {
  activities: AmadeusActivity[];
}

const HorizontalActivitiesList = ({
  activities,
}: HorizontalActivitiesListProps) => {
  return (
    //moze wyswietlaj tylko activities ktore maja description, chyba ze length takich mniejsze niz 20 to wtedy all? albo cos
    //tworzyc tutaj kolekcje divow do dodawania, i je przekazywac do generic componentu przewijaka
    <div className="flex flex-col items-center justify-center font-primaryRegular text-center">
      {activities.map((activity, index) => (
        <div key={activity.id} className="space-y-6 w-8/12">
          <p className="font-primaryBold">{activity.name}</p>
          <p>{activity.description}</p>
          {/* ^cut po 50 znakach */}
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
