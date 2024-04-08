import React, { useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const AnswerPopUp = ({
  open,
  handleClose,
  customMarkerIcon,
  venueCoordinates,
  markerCoordinates,
  distance,
}) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && venueCoordinates && markerCoordinates) {
      let bounds = L.latLngBounds();

      venueCoordinates.forEach((venueCoord) => {
        bounds.extend(venueCoord);
      });

      markerCoordinates.forEach((markerCoord) => {
        bounds.extend(markerCoord);
      });

      const padding = 0.2;
      mapRef.current.fitBounds(bounds.pad(padding));
    }
  }, [venueCoordinates, markerCoordinates]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={true}
      maxWidth={"xl"}
    >
      <DialogTitle style={{ backgroundColor: "#2196f3", color: "#fff" }}>
        Results
      </DialogTitle>
      <DialogContent>
        <h2>Your answer was {distance}km away from the answer</h2>
        <div style={{ width: "100%", height: "80vh" }}>
          <MapContainer
            center={[51.505, -0.09]}
            zoom={4}
            style={{ width: "100%", height: "100%" }}
            ref={mapRef}
          >
            {venueCoordinates.map((venueCoord, index) => (
              <InnerMap
                key={`map${index}`}
                venueCoordinates={venueCoord}
                markerCoordinates={markerCoordinates[index]}
                customMarkerIcon={customMarkerIcon}
              />
            ))}
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

const InnerMap = ({
  venueCoordinates,
  markerCoordinates,
  customMarkerIcon,
}) => {
  const map = useMap();

  useEffect(() => {
    if (venueCoordinates && markerCoordinates) {
      let bounds = L.latLngBounds([venueCoordinates, markerCoordinates]);
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
