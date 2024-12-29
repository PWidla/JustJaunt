// import { useState } from "react";
// import {
//   AmadeusActivity,
//   AmadeusHotel,
//   AmadeusLocation,
// } from "../../api/Amadeus";
// import MapView from "../Map/MapView";

// interface HotelsMapProps {
//   hotels: AmadeusHotel[];
//   searchedCity: AmadeusLocation;
// }

// const HotelsMap = ({ hotels, searchedCity }: HotelsMapProps) => {
//   const [selectedHotels, setSelectedHotels] = useState<AmadeusHotel[]>([]);

//   const addHotelToList = (hotel: AmadeusActivity | AmadeusHotel) => {
//     //to refactor
//     setSelectedHotels((prevHotels) => [...prevHotels, hotel as AmadeusHotel]);
//     console.log(selectedHotels);
//   };

//   return (
//     <div className="border-t-8 flex flex-col justify-start items-center overflow-hidden w-5/6 h-screen mx-auto">
//       {hotels.length > 0 && (
//         <div className="mb-4">
//           <h2 className="pt-10 font-primaryBold text-4xl text-light-wheat text-center md:pb-10">
//             Hotels
//           </h2>
//           <span>
//             You are able to select one hotel by clicking the pin you are
//             interested in.
//           </span>
//         </div>
//       )}

//       <div id="map" className="h-[70vh] w-full">
//         <MapView
//           markers={hotels}
//           centerLocation={searchedCity}
//           selectMarkup={addHotelToList}
//         ></MapView>
//       </div>
//     </div>
//   );
// };

// export default HotelsMap;
