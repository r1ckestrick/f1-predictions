import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import f1Logo from "../assets/images/pplogo.png";

export default function TopNavBar({ nextRace }) {
  const navigate = useNavigate();

  const raceEmojis = {
    "Bahrain Grand Prix": "🏜️",
    "Australian Grand Prix": "🐨",
    "Chinese Grand Prix": "🐉",
    "Japanese Grand Prix": "🍣",
    "Saudi Arabian Grand Prix": "🕌",
    "Miami Grand Prix": "🌴",
    "Emilia Romagna Grand Prix": "🍝",
    "Monaco Grand Prix": "🎰",
    "Spanish Grand Prix": "🐂",
    "Canadian Grand Prix": "🍁",
    "Austrian Grand Prix": "⛰️",
    "British Grand Prix": "🎡",
    "Belgian Grand Prix": "🍟",
    "Hungarian Grand Prix": "🎻",
    "Dutch Grand Prix": "🌷",
    "Italian Grand Prix": "🍕",
    "Azerbaijan Grand Prix": "🏰",
    "Singapore Grand Prix": "🌃",
    "United States Grand Prix": "🦅",
    "Mexico City Grand Prix": "🌮",
    "São Paulo Grand Prix": "🎭",
    "Las Vegas Grand Prix": "🎲",
    "Qatar Grand Prix": "🐪",
    "Abu Dhabi Grand Prix": "🏯",
  };

  const emoji = nextRace ? raceEmojis[nextRace.raceName] || "🏁" : "🏁";

  return (
    <Box
      px={3}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: "60px",
        bgcolor: "#1c1c1e",
        borderBottom: "1px solid #333",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        backdropFilter: "blur(4px)",
      }}
    >
      <Box display="flex" alignItems="center" gap={1} sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
        <img src={f1Logo} alt="logo" width={36} />
      </Box>

      <Button
        size="medium"
       
        sx={{
          borderRadius: "20px",
          textTransform: "none",
          fontWeight: "normal",
          fontSize: "0.7rem",
          px: 2,
          py: 0.5,
          color: "white",
          borderColor: "#333",
          "&:hover": { borderColor: "#555", backgroundColor: "#2c2c2e" }
        }}
      >
        {nextRace ? `Próx. ${emoji} ${nextRace.raceName}` : "Próx. 🏁 -"}
      </Button>
    </Box>
  );
}
