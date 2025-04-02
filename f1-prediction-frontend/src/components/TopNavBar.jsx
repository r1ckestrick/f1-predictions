import { useNavigate } from "react-router-dom";
import { Box, Button, Fade } from "@mui/material";
import f1Logo from "../assets/images/pplogo.png";

export default function TopNavBar({ nextRace, savedMessage }) { // 👈 le pasas el mensaje opcional
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

                    <Box sx={{ 
                position: "relative", 
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "40px"
              }}>
                <Fade in={!!savedMessage} timeout={300}>
                  <Box sx={{ 
                    position: "absolute",
                    bgcolor: savedMessage.includes("Error") ? "#dc2626" : "#22c55e", 
                    color: "white", 
                    px: 2, 
                    py: 0.5, 
                    borderRadius: "20px", 
                    fontSize: "0.7rem",
                    textAlign: "center",
                    transition: "all 0.3s"
                  }}>
                    {savedMessage}
                  </Box>
                </Fade>

                <Fade in={!savedMessage} timeout={300}>
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
                </Fade>
              </Box>
    </Box>
  );
}
