import { Box, Avatar, Paper, Typography } from "@mui/material";
import { PLAYERS } from "../data/players";

const Podium = ({ ranking }) => {
  console.log("Datos recibidos:", ranking);

  if (ranking.length < 3) {
    return <Typography color="gray">Cargando ranking...</Typography>;
  }

  // Correct order: [2nd place, 1st place, 3rd place]
  const orderedRanking = [ranking[1], ranking[0], ranking[2]];

  return (
    <Box
      padding={2}
      display="flex"
      justifyContent="center"
      alignItems="flex-end"
      width="100%"
      gap={5}
    >
      {orderedRanking.map((player, index) => {
        const playerData = PLAYERS[player?.name] || {}; // Avoid errors if player is undefined
        const { name, image, color } = playerData;

        const medal = ["🥈", "🥇", "🥉"]; // First place is always in the center
        const sizes = [50, 80, 40]; // First place gets a bigger avatar
        const widths = ["20%", "30%", "20%"]; // Center has the most space
        const fontSizes = ["2rem", "3rem", "2rem"]; // Bigger medal for first place

        return (
          <Box
            key={name} // Ensure a unique key is assigned to each player
            display="flex"
            flexDirection="column"
            alignItems="center"
            width={widths[index]}
          >
            <Paper
              sx={{
                bgcolor: color,
                color: "white", // Black text for yellow background
                p: 2,
                mt: 2,
                width: "100%",
                textAlign: "center",
                justifyContent: "center"
              }}
            >
              {/* Player Avatar */}
              <Avatar 
                variant="square"
                src={image}
                alt={name}
                sx={{
                  height: { xs: 60, sm: sizes[index] },
                  width: { xs: 60, sm: sizes[index] },
                  border: 1,
                  borderColor: "gray.400",
                }}
              />
              {/* Player Info */}
              <Typography variant="h6" fontWeight="bold">
                {name}
              </Typography>
              <Typography variant="body1">
                {player.total_points ?? 0} Puntos
              </Typography>
              <Typography fontSize={{ xs: "1.5rem", sm: fontSizes[index] }}>
                {medal[index]}
              </Typography>
            </Paper>
          </Box>
        );
      })}
    </Box>
  );
};

export default Podium;
