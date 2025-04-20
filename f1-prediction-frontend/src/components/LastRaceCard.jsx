import { Box, Typography, Avatar, Paper } from "@mui/material";
import { PLAYERS } from "../data/players";
import { RACE_IMAGES } from "../data/raceImages";

export default function LastRaceCard({ race, winner, onClick }) {
  if (!race) return null;

  const raceAssets = RACE_IMAGES[race.raceName] || {};
  const raceImage = raceAssets.background || "/mock-silverstone.jpeg";
  const playerData = PLAYERS[winner?.user] || {};
  const { name, image } = playerData;

  // Texto dummy solo para los aciertos
  const guessText = "Ver Predicciones";

  return (
    <Box
        onClick={onClick}
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
          cursor: onClick ? "pointer" : "default",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          "&:hover": {
            transform: onClick ? "scale(1.01)" : "none",
            boxShadow: onClick ? "0 0 8px rgba(255,255,255,0.2)" : "none"
          }
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
          <Typography variant="caption" color="white">Última Carrera</Typography>
          <Typography variant="body1" color="white" fontWeight="bold">
            {race?.raceName || "Sin nombre"}
          </Typography>
          <Typography variant="caption" color="white">
            {guessText}
          </Typography>
        </Box>

        {/* Right - Avatar + Puntos */}
        {winner && (
          <Box display="flex" flexDirection="column" alignItems="center" gap={0.3}>
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

            <Avatar
              src={image}
              alt={name}
              sx={{
                width: 40,
                height: 40,
                border: "2px solid #ff4655",
                boxShadow: "0 0 8px rgba(255, 70, 85, 0.8)",
                transition: "all 0.3s ease",
              }}
            />

            <Paper
              component="div"
              sx={{
                borderRadius: "5px",
                bgcolor: "#ff4655",
                px: 0.5,
                py: 0.5,
                minWidth: "45px",
                textAlign: "center",
                mt: 0.3,
                cursor: "pointer",
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