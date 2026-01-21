import React, { useRef, useState } from "react";
import {
  GoogleMap,
  LoadScriptNext,
  Marker,
} from "@react-google-maps/api";
import Autocomplete from "react-google-autocomplete";

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "16px", // round border for the map
  overflow: "hidden",
};

const defaultCenter = {
  lat: 32.7767, 
  lng: -96.7970, 
};

const mockSites = [
  {
    name: "TEAM PROFESSIONAL SERVICES – OKLAHOMA CITY",
    address: "4901 west Reno Avenue",
    suite: "Suite 200",
    city: "Oklahoma City, OK 73127",
    lat: 35.4676,
    lng: -97.5164,
    openDays: "Mon Tue Wed Thu Fri Sat Sun",
  },
  {
    name: "COMPLIANCE RESOURCE GROUP",
    address: "300 North Meridian Avenue",
    suite: "Suite 105",
    city: "Oklahoma City, OK 73107",
    lat: 35.4738,
    lng: -97.5386,
    openDays: "Mon Tue Wed Thu Fri Sat Sun",
  },
  {
    name: "ARCOPOINT LABS OF OKLAHOMA",
    address: "2126 South Meridian Avenue",
    suite: "",
    city: "Oklahoma City, OK 73108",
    lat: 35.4451,
    lng: -97.5994,
    openDays: "Mon Tue Wed Thu Fri Sat Sun",
  },
];

const MapWithSearchAndResults = () => {
  const [selectedLocation, setSelectedLocation] = useState(defaultCenter);
  const autoCompleteRef = useRef(null);

  const handlePlaceSelected = (place: any) => {
    const lat = place.geometry?.location?.lat();
    const lng = place.geometry?.location?.lng();
    if (lat && lng) setSelectedLocation({ lat, lng });
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        padding: "20px",
        boxSizing: "border-box",
        gap: "20px",
      }}
    >
      {/* Left Panel */}
      <div
        style={{
          width: "40%",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          overflowY: "auto",
          borderRadius: "16px",
        }}
      >
        <Autocomplete
          apiKey={process.env.GOOGLE_MAPS_API_KEY}
          onPlaceSelected={handlePlaceSelected}
          className="form-control"
          ref={autoCompleteRef}
          options={{
            types: [],
            componentRestrictions: { country: "us" },
          }}
          placeholder="Search for a location"
        />

        {mockSites.map((site, index) => (
          <div
            key={index}
            style={{
              background: "#fff",
              padding: "15px",
              borderRadius: "16px",
              boxShadow: "0 0 8px rgba(0,0,0,0.08)",
            }}
          >
            <h5 style={{ marginBottom: "8px" }}>{index + 1}. {site.name}</h5>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <span style={badgeStyle}>{site.address}</span>
              {site.suite && <span style={badgeStyle}>{site.suite}</span>}
              <span style={badgeStyle}>{site.city}</span>
              <span style={badgeStyle}>Open: {site.openDays}</span>
            </div>
            <button
              onClick={() =>
                setSelectedLocation({ lat: site.lat, lng: site.lng })
              }
              style={{
                marginTop: "10px",
                background: "#28a745",
                color: "#fff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Select Site
            </button>
          </div>
        ))}
      </div>

      {/* Right Panel: Map */}
      <div
        style={{
          width: "60%",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <LoadScriptNext
          googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY!}
          libraries={["places"]}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={selectedLocation}
            zoom={13}
          >
            {mockSites.map((site, index) => (
              <Marker
                key={index}
                position={{ lat: site.lat, lng: site.lng }}
              />
            ))}
          </GoogleMap>
        </LoadScriptNext>
      </div>
    </div>
  );
};

const badgeStyle: React.CSSProperties = {
  background: "#f0f0f0",
  padding: "4px 10px",
  borderRadius: "12px",
  fontSize: "13px",
};

export default MapWithSearchAndResults;






