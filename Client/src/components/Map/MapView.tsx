import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import { Icon } from "leaflet";
import { AmadeusActivity, AmadeusHotel } from "../../api/Amadeus";

const customIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconSize: [38, 38],
});

interface MapProps {
  markers: AmadeusActivity[] | AmadeusHotel[];
}

const MapView = ({ markers }: MapProps) => {
  return (
    <MapContainer
      style={{ height: "100%", width: "100%", borderRadius: "2rem" }}
      center={[48.8566, 2.3522]} //change to city
      zoom={13}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={[marker.geoCode.latitude, marker.geoCode.longitude]}
          icon={customIcon}
        >
          <Popup>{marker.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;