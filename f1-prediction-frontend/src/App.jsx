import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { LoaderProvider } from "./context/LoaderContext";
import { useUser } from "./context/UserContext";
import { Box } from "@mui/material";
import { ThemeProvider } from '@mui/material/styles';
import '@fontsource/gidole'
import Home from "./pages/Home";
import History from "./pages/History";
import Stats from "./pages/Stats";
import Leaderboard from "./pages/Leaderboard";
import TopNavBar from "./components/TopNavBar";
import BottomNavBar from "./components/BottomNavBar";
import MenuSidebar from "./components/MenuSidebar";
import API_URL from "./config";
import useRaceData from "./hooks/useRaceData";
import LoginForm from "./components/LoginForm";
import LoadingOverlay from "./components/LoadingOverlay";
import theme from './theme';

// ✅ APP
export default function App() {
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser, selectUser, logout } = useUser();
  const [showSavedMessage, setShowSavedMessage] = useState("");

  // ✅ GET SEASON
  useEffect(() => {
    fetch(`${API_URL}/get_latest_season`)
      .then((res) => res.json())
      .then((data) => {
        if (data.latest_season) setSelectedSeason(parseInt(data.latest_season));
      });
  }, []);

  // ✅ GET NEXT RACE
  const { nextRace } = useRaceData(selectedSeason);

  // ✅ Admin Mode
  const handleAdminMode = () => {
    alert("Admin Mode Activado");
    setSidebarOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <LoaderProvider>
        {!currentUser ? (
          <Box sx={{
            bgcolor: "background.default",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2
          }}>
            <LoginForm onSelectPlayer={selectUser} />
          </Box>
        ) : (
          <Box
            sx={{
              backgroundColor: "#0f0f0f",
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              pt: 3,
              pb: 3,
            }}
          >
            <TopNavBar nextRace={nextRace} savedMessage={showSavedMessage} />
            <LoadingOverlay />
            <Routes>
              <Route path="/" element={<Stats setShowSavedMessage={setShowSavedMessage} />} />
              <Route path="/history" element={<History setShowSavedMessage={setShowSavedMessage} />} />
              <Route path="/stats" element={<Home setShowSavedMessage={setShowSavedMessage} />} />
              <Route path="/leaderboard" element={<Leaderboard setShowSavedMessage={setShowSavedMessage} />} />
            </Routes>
            <BottomNavBar
              user={currentUser}
              onAdminMode={handleAdminMode}
              onLogout={logout}
              onMenuClick={() => setSidebarOpen(true)}
            />
            <MenuSidebar
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              user={currentUser}
              isAdmin={currentUser?.isAdmin}
              onAdminMode={handleAdminMode}
              onLogout={logout}
            />
          </Box>
        )}
      </LoaderProvider>
    </ThemeProvider>
  );
}
