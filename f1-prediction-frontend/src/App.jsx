import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import History from "./pages/History";
import Stats from "./pages/Stats";
import Leaderboard from "./pages/Leaderboard";
import Menu from "./pages/Menu";
import TopNavBar from "./components/TopNavBar";
import BottomNavBar from "./components/BottomNavBar";
import { Box } from "@mui/material";
import API_URL from "./config";
import useRaceData from "./hooks/useRaceData";

export default function App() {
  const [selectedSeason, setSelectedSeason] = useState(null);

  // ✅ Obtenemos la season real
  useEffect(() => {
    fetch(`${API_URL}/get_latest_season`)
      .then((res) => res.json())
      .then((data) => {
        if (data.latest_season) setSelectedSeason(parseInt(data.latest_season));
      });
  }, []);

  // ✅ Obtenemos nextRace solo cuando ya tenemos la season
  const { nextRace } = useRaceData(selectedSeason);

  return (
    <Box sx={{ bgcolor: "#0f0f0f", minHeight: "100vh", px: 2, py: 3, maxWidth: "1000px", mx: "auto", color: "white" }}>
      <TopNavBar nextRace={nextRace} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>

      <BottomNavBar />
    </Box>
  );
}
