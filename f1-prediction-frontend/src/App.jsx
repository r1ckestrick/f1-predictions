import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History";
import Stats from "./pages/Stats";
import Leaderboard from "./pages/Leaderboard";
import TopNavBar from "./components/TopNavBar";
import BottomNavBar from "./components/BottomNavBar";
import MenuSidebar from "./components/MenuSidebar";
import { Box } from "@mui/material";
import API_URL from "./config";
import useRaceData from "./hooks/useRaceData";
import useCurrentUser from "./hooks/useCurrentUser"
import LoginForm from "./components/LoginForm";


  
export default function App() {
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, login, logout } = useCurrentUser(); 

  // Season Actual
  useEffect(() => {
    fetch(`${API_URL}/get_latest_season`)
      .then((res) => res.json())
      .then((data) => {
        if (data.latest_season) setSelectedSeason(parseInt(data.latest_season));
      });
  }, []);

  // Próxima Carrera
  const { nextRace } = useRaceData(selectedSeason);

  // Admin Mode
  const handleAdminMode = () => {
    alert("Admin Mode Activado");
    setSidebarOpen(false);
  };

  if (!user) {
    // ✅ Login aún no realizado
    return <LoginForm onSelectPlayer={login} />;
  }

  
  return (
    <Box sx={{ bgcolor: "#0f0f0f", minHeight: "100vh", px: 2, py: 3, maxWidth: "1000px", mx: "auto", color: "white" }}>
      <TopNavBar nextRace={nextRace} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>

      <BottomNavBar
        user={user}
        onAdminMode={handleAdminMode}
        onLogout={logout}
        onMenuClick={() => setSidebarOpen(true)}
      />

      <MenuSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        isAdmin={user?.isAdmin}
        onAdminMode={handleAdminMode}
        onLogout={logout}
      />
    </Box>
  );
}
