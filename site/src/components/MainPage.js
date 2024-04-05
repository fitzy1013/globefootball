import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Draggable } from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { getDistance } from "geolib";
import L from "leaflet"; // import leaflet directly
import AnswerPopUp from "./AnswerPopUp";

// Import marker icon image
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconRetina from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Define custom marker icon
const customMarkerIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41], // size of the icon
  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
  shadowSize: [41, 41], // size of the shadow
});

function MainPage() {
  const markerRef = useRef(null);
  const [markerPosition, setMarkerPosition] = useState([51.505, -0.09]);
  const [turnCount, setTurnCount] = useState(0);
  const [clubs, setClubs] = useState([]);
  const [score, setScore] = useState(0);
  const [open, setOpen] = useState(false);
  const [distance, setDistance] = useState(0);
  console.log(clubs);
  console.log(markerPosition);
  console.log(turnCount);
  console.log(score);

  useEffect(() => {
    if (!open && prevOpen.current) {
      setScore((currentScore) => currentScore + distance);
      setTurnCount((currentTurn) => currentTurn + 1);
    }
    prevOpen.current = open;
  }, [open]);

  const prevOpen = useRef(open);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    console.log(lat1);
    console.log(lon1);
    console.log(lat2);
    console.log(lon2);
    const distance = getDistance(
      { latitude: lat1, longitude: lon1 },
      { latitude: lat2, longitude: lon2 }
    );
    return distance / 1000; // Convert meters to kilometers
  };

  useState(() => {
    axios
      .get("http://localhost:3003/api/clubs/random-clubs")
      .then((response) => {
        console.log(response);
        setClubs(response.data);
      });
  }, []);

  const handleMarkerDrag = () => {
    if (markerRef.current != null) {
      setMarkerPosition(markerRef.current.getLatLng());
    }
  };

  const handleSubmit = () => {
    const distance_temp = calculateDistance(
      clubs[turnCount].venueData.latitude,
      clubs[turnCount].venueData.longitude,
      markerPosition.lat,
      markerPosition.lng
    );
    setDistance(distance_temp);
    console.log(distance)
    handleOpen();
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>GlobeFootball</h1>
      <h3 style={{ textAlign: "center" }}>
        Turn: {turnCount + 1}/5 Current Score: {score}
      </h3>
      <h2 style={{ textAlign: "center" }}>
        Drag Marker to where the Clubs Stadium is Located and Hit the Submit
        Button
      </h2>
      <h3 style={{ textAlign: "center" }}>
        Current Club:{" "}
        {clubs.length != 0 && (
          <strong>{clubs[turnCount].clubData.label}</strong>
        )}
      </h3>
      <div style={{ width: "50%", height: "400px", margin: "auto" }}>
        <MapContainer
          center={[51.505, -0.09]}
          zoom={4}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker
            position={markerPosition}
            draggable={true}
            eventHandlers={{
              drag: handleMarkerDrag,
            }}
            ref={markerRef}
            icon={customMarkerIcon}
          ></Marker>
        </MapContainer>
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={handleSubmit}>Submit Answer</button>
      </div>
      {open && (
        <AnswerPopUp
          open={open}
          handleClose={handleClose}
          customMarkerIcon={customMarkerIcon}
          venueCoordinates={[
            clubs[turnCount].venueData.latitude,
            clubs[turnCount].venueData.longitude,
          ]}
          markerCoordinates={markerPosition}
          distance={distance}
        />
      )}
    </div>
  );
}

export default MainPage;
