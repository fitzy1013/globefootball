import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { getDistance } from "geolib";
import axios from "axios";
import L from "leaflet";
import AnswerPopUp from "./AnswerPopUp";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIconRetina from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const customMarkerIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MainPage() {
  const markerRef = useRef(null);
  const [markerPosition, setMarkerPosition] = useState({lat: 51.505, lng: -0.09});
  const [turnCount, setTurnCount] = useState(0);
  const [clubs, setClubs] = useState([]);
  const [score, setScore] = useState(0);
  const [open, setOpen] = useState(false);
  const [distance, setDistance] = useState(0);
  const [roundComplete, setRoundComplete] = useState(false);
  const [venueCoords, setVenueCoords] = useState([]);
  const [markerCoords, setMarkerCoords] = useState([]);
  const [statisticsOpen, setStatisticsOpen] = useState(false);

  console.log("Turn Count ", turnCount)


  useEffect(() => {
    axios
      .get("http://localhost:3003/api/clubs/random-clubs")
      .then((response) => {
        setClubs(response.data);
      });

    const localStorageVenueCoords = localStorage.getItem("venueCoords");
    const localStorageMarkerCoords = localStorage.getItem("markerCoords");

    if (localStorageVenueCoords && localStorageMarkerCoords) {
      const parsedVenueCoords = JSON.parse(localStorageVenueCoords);
      const parsedMarkerCoords = JSON.parse(localStorageMarkerCoords);

      setVenueCoords(parsedVenueCoords);
      setMarkerCoords(parsedMarkerCoords);
      setTurnCount(parsedMarkerCoords.length);
    }
  }, []);

  const handleClose = () => {
    if (turnCount >= 4) {
      setRoundComplete(false);
    }
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const updateScores = (newScore) => {
    const currentDate = new Date().toLocaleDateString();
    const updatedScores = { score: newScore, date: currentDate };
    localStorage.setItem("score", JSON.stringify(updatedScores));
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const distance = getDistance(
      { latitude: lat1, longitude: lon1 },
      { latitude: lat2, longitude: lon2 }
    );
    return distance / 1000; // Convert meters to kilometers
  };

  useEffect(() => {
    if (!open && prevOpen.current) {
      setMarkerPosition()
      setScore((currentScore) => currentScore + distance);
      if (turnCount < 4) {
        updateScores(distance + score);
        setTurnCount((currentTurn) => currentTurn + 1);

      } else {
        setRoundComplete(true);
        const storedScores = JSON.parse(localStorage.getItem("scores")) || [];
        const currentDate = new Date().toLocaleDateString();
        const updatedScores = [...storedScores, {score: score + distance, date: currentDate}];
        localStorage.setItem("scores", JSON.stringify(updatedScores));
        setOpen(true);
      }
    }
    prevOpen.current = open;
  }, [open]);

  const prevOpen = useRef(open);

  const handleMarkerDrag = () => {
    if (markerRef.current != null) {
      setMarkerPosition(markerRef.current.getLatLng());
    }
  };

  const handleSubmit = () => {
    // Update venueCoords and markerCoords
    const tempVenueCoords = [...venueCoords, { lat: clubs[turnCount].venueData.latitude, lng: clubs[turnCount].venueData.longitude }];
    localStorage.setItem("venueCoords", JSON.stringify(tempVenueCoords));
    setVenueCoords(tempVenueCoords);

    const tempMarkerCoords = [...markerCoords, { lat: markerPosition.lat, lng: markerPosition.lng }];
    localStorage.setItem("markerCoords", JSON.stringify(tempMarkerCoords));
    setMarkerCoords(tempMarkerCoords);

    console.log(markerPosition);

    // Calculate distance and update score
    const distance_temp = calculateDistance(
      clubs[turnCount].venueData.latitude,
      clubs[turnCount].venueData.longitude,
      markerPosition.lat,
      markerPosition.lng
    );
    setDistance(distance_temp);
    setScore((currentScore) => currentScore + distance_temp);

    // Open the popup
    setOpen(true);
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#f0f0f0",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>GlobeFootball</h1>
      <p style={{ marginBottom: "20px", fontSize: "18px" }}>
        Drag the marker to where the club's stadium is located and hit the
        "Submit" button.
      </p>
      <p style={{ marginBottom: "20px", fontSize: "16px" }}>
        Turn: {turnCount + 1}/5 &nbsp;|&nbsp; Current Score: {score}
      </p>
      <p style={{ marginBottom: "20px", fontSize: "18px" }}>
        Current Club:{" "}
        {clubs.length !== 0 && (
          <strong>{clubs[turnCount].clubData.label}</strong>
        )}
      </p>
      <div style={{ width: "80%", margin: "auto", marginBottom: "20px" }}>
        <MapContainer
          center={[51.505, -0.09]}
          zoom={4}
          style={{ width: "100%", height: "400px" }}
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
      <button
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
        onClick={handleSubmit}
      >
        Submit Answer
      </button>
      {open && !roundComplete && (
        <AnswerPopUp
          open={open}
          handleClose={handleClose}
          customMarkerIcon={customMarkerIcon}
          venueCoordinates={[
            [
              clubs[turnCount].venueData.latitude,
              clubs[turnCount].venueData.longitude,
            ],
          ]}
          markerCoordinates={[markerPosition]}
          distance={distance}
        />
      )}
      {open && roundComplete && (
        <AnswerPopUp
          open={open}
          handleClose={handleClose}
          customMarkerIcon={customMarkerIcon}
          venueCoordinates={venueCoords}
          markerCoordinates={markerCoords}
          distance={score}
        />
      )}
    </div>
  );
}

export default MainPage;
