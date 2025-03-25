import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

export default function RaceInfoCard({ raceInfo, selectedRace }) {
  // Asegúrate de que raceInfo esté disponible antes de usarlo
  if (!raceInfo) return null;

  // Definir formatDate dentro del componente para acceder a raceInfo
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Card sx={{ bgcolor: "#1f2937", color: "white", mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {raceInfo.name}
        </Typography>
        <Typography variant="body2" color="gray">
          Ronda {selectedRace} – {formatDate(raceInfo.date)}
        </Typography>
        <Typography variant="body2" color="gray" sx={{ mb: 2 }}>
          {raceInfo.circuit} – {raceInfo.location}
        </Typography>

        {raceInfo.imageUrl ? (
          <Box
            component="img"
            src={raceInfo.imageUrl}
            alt={`Circuito de ${raceInfo.name}`}
            sx={{
              width: "100%",
              height: "auto",
              borderRadius: 2,
              boxShadow: 3,
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/800x400?text=Mapa+No+Disponible";
            }}
          />
        ) : (
          <Typography variant="body2" color="gray">
            Imagen no disponible
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
