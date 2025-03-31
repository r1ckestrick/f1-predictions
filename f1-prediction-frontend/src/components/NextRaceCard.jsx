import { Box, Typography } from "@mui/material";
import { RACE_IMAGES } from "../data/raceImages";

export default function NextRaceCard({ race }) {
  if (!race) return null;

  const raceImage = RACE_IMAGES[race.raceName] || "/mock-silverstone.jpeg";

return (
    <Box
      mb={3}
      sx={{
        height: 180,
        borderRadius: 2,
        backgroundImage: `url(${raceImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 0 4px rgba(255,255,255,0.05)",
      }}
    >
      <Box sx={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
      <Box sx={{ position: "absolute", bottom: 8, left: 8 }}>
        <Typography variant="caption" color="white">Próxima Carrera</Typography>
        <Typography variant="body1" color="white" fontWeight="bold">{race?.raceName || "Sin nombre"}</Typography>
        <Typography variant="caption" color="white">Fecha: {race?.date || "-"}</Typography>
      </Box>
    </Box>
  );
}
