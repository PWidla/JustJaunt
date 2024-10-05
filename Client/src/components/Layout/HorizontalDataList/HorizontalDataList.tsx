import { AmadeusActivity, AmadeusHotel } from "../../../api/Amadeus";

interface HorizontalDataListProps {
  items: AmadeusActivity[] | AmadeusHotel[];
}

const HorizontalDataList = ({ items }: HorizontalDataListProps) => {
  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>{item.name}</div>
      ))}
    </div>
  );
};

export default HorizontalDataList;
