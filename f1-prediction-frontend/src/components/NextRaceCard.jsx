import { Box, Typography } from "@mui/material";
import { RACE_IMAGES } from "../data/raceImages";
import RaceAlert from "./RaceAlert"; // <-- recuerda importarlo bien

export default function NextRaceCard({ race }) {
  if (!race) return null;

  const raceImage = RACE_IMAGES[race.raceName] || "/mock-silverstone.jpeg";

  return (
    <Box
      mb={3}
      sx={{
        height: 130,
        borderRadius: 2,
        backgroundImage: `url(${raceImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 0 8px rgba(255,255,255,0.05)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 0 12px rgba(255,255,255,0.2)",
        },
      }}
    >
      <Box sx={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />

      <Box
        sx={{
          position: "absolute",
          bottom: 8,
          left: 8,
          right: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left - Info carrera */}
        <Box>
          {/* 🟣 RaceAlert bien arriba */}
          <Box mb={1}>{race && <RaceAlert race={race} />}</Box>

          <Typography variant="caption" color="white">Próxima Carrera</Typography>
          <Typography variant="body1" color="white" fontWeight="bold">
            {race?.raceName || "Sin nombre"}
          </Typography>
          <Typography variant="caption" color="white">
            Fecha: {race?.date || "-"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
