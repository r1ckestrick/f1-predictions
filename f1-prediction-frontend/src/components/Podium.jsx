import { Box, Avatar, Paper, Typography } from "@mui/material";
import { PLAYERS } from "../data/players";

const Podium = ({ ranking }) => {
  if (ranking.length < 3) {
    return <Typography color="gray">Cargando ranking...</Typography>;
  }

  const cardColors = ["#1c1c1e", "#ffffff", "#ffffff"];
  const textColors = ["white", "black", "black"];
  const positionColors = ["#ff9f0a", "#007aff", "#30d158"];

  return (
    <Box display="flex" flexDirection="column" gap={2} mt={2}>
      {ranking.slice(0, 3).map((player, index) => {
        const playerData = PLAYERS[player?.name] || {};
        const { name, image } = playerData;
        const [firstName, ...lastNameParts] = name.split(" ");
        const lastName = lastNameParts.join(" ");

        return (
          <Paper
            key={name}
            elevation={3}
            sx={{
              bgcolor: cardColors[index],
              borderRadius: 2,
              px: 2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            }}
          >
            {/* Position */}
            <Typography
              variant="h5"
              fontWeight="bold"
              color={positionColors[index]}
              sx={{ minWidth: "30px" }}
            >
              {index + 1}
            </Typography>

            {/* Name & Points */}
            <Box textAlign="left" flex={1} ml={1}>
              <Typography
                variant="body2"
                sx={{ color: textColors[index], opacity: 0.8 }}
              >
                {firstName}
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: textColors[index], lineHeight: 1 }}
              >
                {lastName}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: textColors[index], opacity: 0.7 }}
              >
                Prediction Party Player
              </Typography>
            </Box>

            {/* Points + Avatar */}
            <Box display="flex" alignItems="center" gap={1}>
              <Paper
                sx={{
                  borderRadius: "20px",
                  bgcolor: "white",
                  px: 1.5,
                  py: 0.5,
                  minWidth: "45px",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color="black"
                >
                  {player.total_points ?? 0} pts
                </Typography>
              </Paper>
              <Avatar
                src={image}
                alt={name}
                sx={{
                  width: 40,
                  height: 40,
                  border: "2px solid white",
                }}
              />
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
};

export default Podium;
