import React, { useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const AnswerPopUp = ({ open, handleClose, customMarkerIcon, venueCoordinates, markerCoordinates, distance }) => {
  const mapRef = useRef(null);
  console.log(distance)

  useEffect(() => {
    if (mapRef.current && venueCoordinates && markerCoordinates) {
      const bounds = L.latLngBounds([venueCoordinates, markerCoordinates]);
      mapRef.current.fitBounds(bounds);
    }
  }, [venueCoordinates, markerCoordinates]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth={'xl'}>
      <DialogTitle>Results</DialogTitle>
      <DialogContent>
        <h2>Your answer was {distance}km away from the answer</h2>
        <div style={{ width: "100%", height: "80vh" }}>
          <MapContainer
            center={[51.505, -0.09]}
            zoom={4}
            style={{ width: "100%", height: "100%" }}
          >
            <InnerMap
              venueCoordinates={venueCoordinates}
              markerCoordinates={markerCoordinates}
              customMarkerIcon={customMarkerIcon}
            />
          </MapContainer>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const InnerMap = ({ venueCoordinates, markerCoordinates, customMarkerIcon }) => {
  const map = useMap();

  useEffect(() => {
    if (venueCoordinates && markerCoordinates) {
      const bounds = L.latLngBounds([venueCoordinates, markerCoordinates]);
      map.fitBounds(bounds);
    }
  }, [map, venueCoordinates, markerCoordinates]);

  return (
    <>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={venueCoordinates} icon={customMarkerIcon}>
        <Popup>Venue</Popup>
      </Marker>
      <Marker position={markerCoordinates} icon={customMarkerIcon}>
        <Popup>Marker</Popup>
      </Marker>
      <Polyline positions={[venueCoordinates, markerCoordinates]} color="blue" />
    </>
  );
};

export default AnswerPopUp;
