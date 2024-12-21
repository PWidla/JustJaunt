import "./MapViewStyles.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import {
  AmadeusActivity,
  AmadeusHotel,
  AmadeusLocation,
} from "../../api/Amadeus";
import MarkerClusterGroup from "react-leaflet-cluster";

const customIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconSize: [38, 38],
});

interface MapProps {
  markers: AmadeusActivity[] | AmadeusHotel[];
  centerLocation: AmadeusLocation;
  selectMarkup: (markup: AmadeusActivity | AmadeusHotel) => void;
}

const isActivity = (
  marker: AmadeusActivity | AmadeusHotel
): marker is AmadeusActivity => {
  return (marker as AmadeusActivity).description !== undefined;
};

const MapView = ({ markers, centerLocation, selectMarkup }: MapProps) => {
  return (
    <MapContainer
      style={{ height: "100%", width: "100%", borderRadius: "2rem" }}
      center={[
        centerLocation.geoCode.latitude,
        centerLocation.geoCode.longitude,
      ]}
      zoom={13}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarkerClusterGroup>
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={[marker.geoCode.latitude, marker.geoCode.longitude]}
            icon={customIcon}
          >
            <Popup>
              <div className="flex flex-col items-center justify-center text-center w-full max-w-xs p-2">
                <h2 className="text-xl font-bold mb-2">{marker.name}</h2>

                {isActivity(marker) && (
                  <>
                    {marker.pictures && (
                      <img
                        src={marker.pictures}
                        alt={marker.name}
                        className="w-full h-auto max-h-48 object-contain mb-2"
                      />
                    )}
                    <p className="text-sm max-h-40 overflow-auto mb-2">
                      {marker.description}
                    </p>
                  </>
                )}

                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded mt-2"
                  onClick={() => selectMarkup(marker)}
                >
                  Add to My Plan
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default MapView;
