import { Box, Avatar, Paper, Typography } from "@mui/material";
import { PLAYERS } from "../data/players";
import { motion } from "framer-motion";

// ✨ Colores F1 Pro
const cardColors = ["#1c1c1c", "#1c1c1c", "#1c1c1c"];
const textColors = ["#ffffff", "#ffffff", "#ffffff"];
const positionColors = ["#FFD700", "#C0C0C0", "#CD7F32"]; // Oro, Plata, Bronce
const badgeColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const Podium = ({ ranking }) => {
  if (ranking.length < 3) {
    return <Typography color="gray">Cargando ranking...</Typography>;
  }

  return (
    <Box display="flex" flexDirection="column" gap={2} mt={2}>
      {ranking.slice(0, 3).map((player, index) => {
        const playerData = PLAYERS[player?.name] || {};
        const { name, image } = playerData;
        const [firstName, ...lastNameParts] = name.split(" ");
        const lastName = lastNameParts.join(" ");

        return (
          <motion.div
            key={name}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <Paper
              elevation={4}
              sx={{
                bgcolor: cardColors[index],
                borderRadius: 3,
                px: 2,
                py: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: `2px solid ${badgeColors[index]}`,
                boxShadow: `0 0 8px ${badgeColors[index]}55`,
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
                  sx={{ color: textColors[index], opacity: 0.5 }}
                >
                  Prediction Party Player
                </Typography>
              </Box>

              {/* Points + Avatar */}
              <Box display="flex" alignItems="center" gap={1}>
                <Paper
                  sx={{
                    borderRadius: "3px",
                    bgcolor: "#ff4655",
                    px: 0.8,
                    py: 0.2,
                    minWidth: "40px",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color="#ffffff"
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
                    border: `2px solid ${badgeColors[index]}`,
                  }}
                />
              </Box>
            </Paper>
          </motion.div>
        );
      })}
    </Box>
  );
};

export default Podium;
