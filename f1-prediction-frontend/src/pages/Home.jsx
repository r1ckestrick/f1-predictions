// ✅ IMPORTACIONES
import { useState, useEffect } from "react";
import * as React from "react";
import API_URL from "config.js";
import "@fontsource/barlow-condensed";
import { CIRCUIT_IMAGES } from "../data/circuitImages";
import { useNavigate } from "react-router-dom";

// ✅ COMPONENTES
import BottomNavBar from "../components/BottomNavBar";
import Podium from "components/Podium";
import PredictionsTable from "components/PredictionsTable";
import LoginForm from "components/LoginForm";
import { Box, Typography, Button } from "@mui/material";
import f1Logo from "assets/images/f1-logo-white.png";

// ✅ HOME
export default function Home() {
  const [selectedSeason, setSelectedSeason] = useState(2025);
  const [races, setRaces] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [raceResults, setRaceResults] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPredictions, setEditedPredictions] = useState({});
  const [hasOfficialResults, setHasOfficialResults] = useState(false);
  const [lastRace, setLastRace] = useState(null);
  const [nextRace, setNextRace] = useState(null);
  const navigate = useNavigate();

  const categories = {
    pole: "POLE", p1: "P1", p2: "P2", p3: "P3", fastest_lap: "FL",
    dnf: "DNF", positions_gained: "POG", positions_lost: "POL",
    best_of_the_rest: "BOR", midfield_master: "MFM"
  };

  // ✅ CARGA INICIAL
  useEffect(() => {
    fetch(`${API_URL}/get_latest_season`)
      .then((res) => res.json())
      .then((data) => {
        if (data.latest_season) setSelectedSeason(parseInt(data.latest_season));
      });
  }, []);

  // ✅ CARGA DRIVERS
  useEffect(() => {
    if (!selectedSeason) return;
    fetch(`${API_URL}/get_drivers/${selectedSeason}`)
      .then((res) => res.json())
      .then((data) => setDrivers(data.drivers || []));
  }, [selectedSeason]);

  // ✅ CARGA DE CARRERAS + LEADERBOARD
  useEffect(() => {
    if (!selectedSeason) return;

    fetch(`${API_URL}/get_all_races/${selectedSeason}`)
      .then((res) => res.json())
      .then(async (data) => {
        const allRaces = data.races || [];
        const racesWithDetails = await Promise.all(
          allRaces.map(async (race) => {
            const res = await fetch(`${API_URL}/get_race_info/${selectedSeason}/${race.round}`);
            return await res.json();
          })
        );
        const today = new Date();
        const pastRaces = racesWithDetails.filter(r => new Date(r.date) <= today);
        const futureRaces = racesWithDetails.filter(r => new Date(r.date) > today);

        setLastRace(pastRaces[pastRaces.length - 1] || null);
        setNextRace(futureRaces[0] || null);
        setRaces(racesWithDetails);
      });

    fetch(`${API_URL}/leaderboard`)
      .then((res) => res.json())
      .then((data) => setLeaderboard(data));
  }, [selectedSeason]);

  // ✅ CARGA PREDICCIONES PRÓXIMA CARRERA
  useEffect(() => {
    if (!nextRace) return;
    fetch(`${API_URL}/get_race_predictions/${selectedSeason}/${nextRace.round}`)
      .then((res) => res.json())
      .then((data) => setPredictions(data.predictions || []));
  }, [nextRace, selectedSeason]);

  // ✅ GUARDAR PREDICCIONES
  function handleSavePredictions() {
    if (!nextRace || !currentUser) return;
    fetch(`${API_URL}/save_predictions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: currentUser,
        season: selectedSeason,
        race: nextRace.round,
        predictions: editedPredictions[currentUser] || {}
      })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message || "Predicciones guardadas");
        setIsEditing(false);
      })
      .catch(() => alert("Error al guardar predicciones"));
  }

  // ✅ LOGIN SIMPLE
  if (!currentUser) {
    return (
      <Box sx={{ bgcolor: "#0f0f0f", minHeight: "100vh", px: 2, py: 3, maxWidth: "1000px", mx: "auto", color: "white" }}>
        <LoginForm onSelectPlayer={setCurrentUser} />
      </Box>
    );
  }

  // ✅ UI PRINCIPAL
  return (
    <Box sx={{ bgcolor: "#0f0f0f", minHeight: "100vh", px: 2, py: 3, maxWidth: "1000px", mx: "auto", color: "white" }}>

      {/* HEADER */}
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={1}>
          <img src={f1Logo} alt="logo" width={50} />
          <Typography variant="h6" sx={{ fontFamily: "'Barlow Condensed'", fontWeight: "bold" }}>
            Prediction Party
          </Typography>
        </Box>
        <Button size="small" variant="outlined" color="error" onClick={() => setCurrentUser(null)}>
          Salir
        </Button>
      </Box>

      {/* PODIO */}
      <Box mb={3} sx={{ bgcolor: "#1c1c1e", borderRadius: 2, boxShadow: "0 0 4px rgba(255,255,255,0.05)", p: 2 }}>
        <Podium ranking={leaderboard} />
      </Box>

      {/* ÚLTIMA CARRERA */}
      {lastRace && (
        <Button onClick={() => navigate(`/history?season=${selectedSeason}&round=${lastRace.round}`)} fullWidth sx={{ mb: 2 }}>
          <Box sx={{ height: 180, borderRadius: 2, overflow: "hidden", position: "relative", boxShadow: "0 0 4px rgba(255,255,255,0.05)" }}>
            <img 
              src={CIRCUIT_IMAGES[lastRace.circuitName] || "./public/mock-circuit.png.png"} 
              alt={lastRace.circuitName}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <Box sx={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
            <Box sx={{ position: "absolute", bottom: 8, left: 8 }}>
              <Typography variant="caption" color="white">Última Carrera</Typography>
              <Typography variant="body1" color="white" fontWeight="bold" sx={{ fontFamily: "'Barlow Condensed'" }}>
                {lastRace?.raceName || "Cargando..."}
              </Typography>
              <Typography variant="caption" color="white">
                Fecha: {lastRace?.date || "-"}
              </Typography>
            </Box>
          </Box>
        </Button>
      )}

      {/* TABLA */}
      <Box mb={2}>
        <PredictionsTable
          categories={categories}
          predictions={predictions}
          players={["Renato", "Sebastian", "Enrique"]}
          raceResults={raceResults}
          drivers={drivers}
          currentUser={currentUser}
          isEditing={isEditing}
          setEditedPredictions={setEditedPredictions}
          editedPredictions={editedPredictions}
          handleSavePredictions={handleSavePredictions}
          hasOfficialResults={hasOfficialResults}
          nextRace={nextRace}
        />

        {currentUser && (
          <Box mt={2} textAlign="center">
            {!isEditing ? (
              <Button variant="outlined" color="primary" onClick={() => setIsEditing(true)}>
                Editar Predicciones
              </Button>
            ) : (
              <Button variant="contained" color="success" onClick={handleSavePredictions}>
                Guardar Predicciones
              </Button>
            )}
          </Box>
        )}
      </Box>

      <BottomNavBar />
    </Box>
  );
}
