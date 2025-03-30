// ✅ RaceCard.jsx
import { Box, Typography } from "@mui/material";
import { CIRCUIT_IMAGES } from "../data/circuitImages";

const RaceCard = ({ race, label }) => {
  if (!race) return null;

  const imageUrl = CIRCUIT_IMAGES[race.circuitName] || '/assets/images/mock-circuit.png';

  return (
    <Box
      mb={3}
      sx={{
        height: 180,
        borderRadius: 2,
        backgroundImage: `url('${imageUrl}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 0 4px rgba(255,255,255,0.05)",
      }}
    >
      <Box sx={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
      <Box sx={{ position: "absolute", bottom: 8, left: 8 }}>
        <Typography variant="caption" color="white">{label}</Typography>
        <Typography variant="body1" color="white" fontWeight="bold" sx={{ fontFamily: "'Barlow Condensed'" }}>
          {race.raceName}
        </Typography>
        <Typography variant="caption" color="white">
          {race.date}
        </Typography>
      </Box>
    </Box>
  );
};

export default RaceCard;
