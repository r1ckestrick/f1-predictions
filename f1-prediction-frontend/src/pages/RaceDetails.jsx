import { Paper, Typography, CardMedia } from "@mui/material";
import { formatDate } from "../utils/helpers";

const RaceDetails = ({ raceInfo, selectedRace }) => {
  return (
    raceInfo && (
      <Paper
        sx={{
          bgcolor: "gray.800",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          textAlign: "center",
          mb: 6,
        }}
      >
        {/* Nombre de la carrera */}
        <Typography variant="h5" fontWeight="bold"  mb={2}>
          {raceInfo.name}
        </Typography>

        {/* Ronda y fecha */}
        <Typography color="gray.300">
          Ronda {selectedRace} - {formatDate(raceInfo.date)}
        </Typography>

        {/* Circuito y ubicación */}
        <Typography color="gray.300">
          {raceInfo.circuit} - {raceInfo.location}
        </Typography>

        {/* Imagen del circuito con fallback */}
        {raceInfo.imageUrl ? (
          <CardMedia
            component="img"
            image={raceInfo.imageUrl}
            alt={`Circuito de ${raceInfo.name}`}
            sx={{
              width: "100%",
              height: "auto",
              borderRadius: 2,
              boxShadow: 3,
              mt: 4,
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/800x400?text=Mapa+No+Disponible";
            }}
          />
        ) : (
          <Typography color="gray.500" mt={2}>
            Imagen no disponible
          </Typography>
        )}
      </Paper>
    )
  );
};

export default RaceDetails;
