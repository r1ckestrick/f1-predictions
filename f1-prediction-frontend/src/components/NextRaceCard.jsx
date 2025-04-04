import { Box, Typography } from "@mui/material";
import { RACE_IMAGES } from "../data/raceImages";
import RaceAlert from "./RaceAlert"; // <-- recuerda importarlo bien

const fallbackImage = "/mock-silverstone.jpeg";

export default function NextRaceCard({ race }) {
  if (!race) return null;

  const raceAssets = RACE_IMAGES[race.raceName] || {};
  const backgroundImage = raceAssets.background || fallbackImage;
  const circuitOverlay = raceAssets.circuit || null;

  return (
    <Box
      mb={3}
      sx={{
        height: 130,
        borderRadius: 2,
        backgroundImage: `url(${backgroundImage})`,
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
      {/* Overlay oscuro */}
      <Box sx={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />

      {/* Contenido */}
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
          <Box mb={1}>{race && <RaceAlert race={race} />}</Box>
          <Typography variant="caption" color="white">Próxima Carrera</Typography>
          <Typography variant="body1" color="white" fontWeight="bold">
            {race?.raceName || "Sin nombre"}
          </Typography>
          <Typography variant="caption" color="white">
            Fecha: {race?.date || "-"}
          </Typography>
        </Box>

        {/* Right - Circuit overlay */}
        {circuitOverlay && (
          <Box>
            <img
              src={circuitOverlay}
              alt=""
              style={{
                height: 90,
                opacity: 0.85,
                filter: "drop-shadow(0 0 3px black)",
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
