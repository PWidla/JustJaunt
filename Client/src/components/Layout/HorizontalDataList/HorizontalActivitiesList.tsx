import { AmadeusActivity } from "../../../api/Amadeus";

interface HorizontalActivitiesListProps {
  activities: AmadeusActivity[];
}

const HorizontalDataList = ({ activities }: HorizontalActivitiesListProps) => {
  return (
    //moze wyswietlaj tylko activities ktore maja description, chyba ze length takich mniejsze niz 20 to wtedy all? albo cos
    <div>
      {activities.map((activity, index) => (
        <div key={activity.id}>
          <p className="font-primaryBold">{activity.name}</p>
          <p className="font-primaryRegular">{activity.description}</p>
          {/* ^cut po 50 znakach */}
          <img
            src={`${activity.pictures}`}
            alt={`${activity.name} picture`}
            className="object-contain md:object-scale-down w-full h-auto"
          />
        </div>
      ))}
    </div>
  );
};

export default HorizontalDataList;
