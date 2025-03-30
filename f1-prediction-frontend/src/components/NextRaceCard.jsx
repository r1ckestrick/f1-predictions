import { Box, Typography } from "@mui/material";
import { CIRCUIT_IMAGES } from "../data/circuitImages";

export default function NextRaceCard({ race }) {
  if (!race) return null;

  const circuitImage = CIRCUIT_IMAGES[race.circuitName] || '../public/mock-circuit.png';

  return (
    <Box
      mb={3}
      sx={{
        height: 180,
        borderRadius: 2,
        backgroundImage: `url('${circuitImage}')`,
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
        <Typography variant="body1" color="white" fontWeight="bold">
          {race.raceName}
        </Typography>
        <Typography variant="caption" color="white">
          Fecha: {race.date}
        </Typography>
      </Box>
    </Box>
  );
}
