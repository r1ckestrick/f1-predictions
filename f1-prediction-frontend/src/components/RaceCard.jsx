import { Box, Typography, Avatar, Paper } from "@mui/material";
import { PLAYERS } from "../data/players";
import RaceAlert from "./RaceAlert";
import { RACE_IMAGES } from "../data/raceImages";

export default function RaceCard({ race, winner }) {
  if (!race) return null;

  const raceImage = RACE_IMAGES[race.raceName] || "/mock-silverstone.jpeg";

  // Info del ganador (puedes ajustarlo)
  const playerData = PLAYERS[winner?.user] || {};
  const { name, image } = playerData;

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
        boxShadow: "0 0 4px rgba(255,255,255,0.05)",
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
          <Box mb={1}>{race && <RaceAlert race={race} />}</Box>
          <Typography variant="caption" color="white">Ronda</Typography>
          <Typography variant="body1" color="white" fontWeight="bold">
            {race?.raceName || "Sin nombre"}
          </Typography>
          <Typography variant="caption" color="white">
            Fecha: {race?.date || "-"}
          </Typography>
        </Box>

 {/* Right - Ganador */}
{winner && (
  <Box display="flex" flexDirection="column" alignItems="center" gap={0.3}>
    
    {/* 🏁 Bandera con sombra */}
    <Typography
      variant="body2"
      sx={{
        color: "#ffcc00",
        fontSize: "1.3rem",
        textShadow: "0 0 3px rgba(0,0,0,0.6)",
      }}
    >
      🏁
    </Typography>

    {/* Avatar con glow */}
    <Avatar
      src={image}
      alt={name}
      sx={{
        width: 40,
        height: 40,
        border: "2px solid #ff4655",
        boxShadow: "0 0 8px rgba(255, 70, 85, 0.8)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 0 12px rgba(255, 70, 85, 1)",
          transform: "scale(1.05)",
        }
      }}
    />

    {/* Badge Rojo con hover visible */}
    <Paper
      component="div" // 👈 forza comportamiento de div
      sx={{
        borderRadius: "5px",
        bgcolor: "#ff4655",
        px: 0.5,
        py: 0.5,
        minWidth: "45px",
        textAlign: "center",
        mt: 0.3,
        transition: "all 0.3s ease",
        cursor: "pointer",
        marginBottom: 1,
        "&:hover": {
          boxShadow: "0 0 6px rgba(255,70,85,0.7)",
          transform: "scale(1.04)",
        },
      }}
    >
      <Typography variant="body2" fontWeight="bold" color="#ffffff">
        {winner.points ?? 0} pts
      </Typography>
    </Paper>
  </Box>
)}



      </Box>
    </Box>
  );
}
