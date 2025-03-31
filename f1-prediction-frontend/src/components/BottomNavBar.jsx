import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Home, Trophy, Archive, BarChart3, Menu } from "lucide-react";

export default function BottomNavBar() {
  const navigate = useNavigate();
  const [value, setValue] = useState(() => {
    const path = window.location.pathname;
    if (path.includes("stats")) return "stats";
    if (path.includes("leaderboard")) return "leaderboard";
    if (path.includes("history")) return "history";
    if (path.includes("menu")) return "menu";
    return "home";
  });

  const handleChange = (_, newValue) => {
    setValue(newValue);
    navigate(newValue === "home" ? "/" : `/${newValue}`);
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        bgcolor: "#1c1c1e",
        borderTop: "1px solid #333",
        boxShadow: "0 -2px 6px rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
        zIndex: 99,
        borderRadius: "0px",
        mx: "0px",
        mb: "00px",
      }}
      elevation={8}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        showLabels={false}
        sx={{
          bgcolor: "transparent",
          height: "50px",
          px: 1,
        }}
      >
        <BottomNavigationAction value="stats" icon={<BarChart3 size={20} />} sx={navItemStyle(value === "stats")} />
        <BottomNavigationAction value="leaderboard" icon={<Trophy size={20} />} sx={navItemStyle(value === "leaderboard")} />
        <BottomNavigationAction value="home" icon={<Home size={20} />} sx={navItemStyle(value === "home")} />
        <BottomNavigationAction value="history" icon={<Archive size={20} />} sx={navItemStyle(value === "history")} />
        <BottomNavigationAction value="menu" icon={<Menu size={20} />} sx={navItemStyle(value === "menu")} />
      </BottomNavigation>
    </Paper>
  );
}

// ✅ Estilo limpio, moderno y pro
function navItemStyle(selected) {
  return {
    color: selected ? "white" : "#999",
    transition: "all 0.3s ease",
    borderRadius: "8px",
    mx: .05,
    position: "relative",
    "&::after": {
      content: '""',
      display: "block",
      width: "20%",
      height: "3px",
      borderRadius: "2px",
      backgroundColor: selected ? "white" : "transparent",
      margin: "4px auto 0 auto",
      transition: "all 0.3s ease",
    },
    "&:hover": {
      transform: "translateY(-2px)", // levanta un poco
      backgroundColor: "transparent", // sin fondo sucio
    },
  };
}
