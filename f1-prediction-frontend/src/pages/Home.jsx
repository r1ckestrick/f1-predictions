// ✅ IMPORTACIONES
import { useState, useEffect } from "react";
import * as React from "react";
import API_URL from "config.js";
import "@fontsource/barlow-condensed";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";


// ✅ COMPONENTES
import BottomNavBar from "../components/BottomNavBar";
import Podium from "components/Podium";
import PredictionsTable from "components/PredictionsTable";
import LoginForm from "components/LoginForm";
import LastRaceCard from "../components/LastRaceCard";
import useRaceData from "../hooks/useRaceData";
import { Box, Button } from "@mui/material";

// ✅ HOME
export default function Home() {
  const [selectedSeason, setSelectedSeason] = useState(2025);
  const [leaderboard, setLeaderboard] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const { currentUser, selectUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPredictions, setEditedPredictions] = useState({});
  const navigate = useNavigate();

  const { lastRace, nextRace} = useRaceData(selectedSeason);

  const [raceResults, setRaceResults] = useState({});
  const [hasOfficialResults, setHasOfficialResults] = useState(false);

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

  // ✅ CARGA LEADERBOARD
  useEffect(() => {
    fetch(`${API_URL}/leaderboard`)
      .then((res) => res.json())
      .then(setLeaderboard);
  }, []);

  // ✅ CARGA PREDICCIONES PRÓXIMA CARRERA
  useEffect(() => {
    if (!nextRace) return;
    fetch(`${API_URL}/get_race_predictions/${selectedSeason}/${nextRace.round}`)
      .then((res) => res.json())
      .then((data) => setPredictions(data.predictions || []));
  }, [nextRace, selectedSeason]);

  // ✅ CARGA RESULTADOS PRÓXIMA CARRERA
useEffect(() => {
  if (!nextRace || !nextRace.round) return;

  fetch(`${API_URL}/get_race_results/${selectedSeason}/${nextRace.round}`)
    .then(res => {
      if (res.status === 404) {
        // La carrera aún no tiene resultados
        setRaceResults(null);
        setHasOfficialResults(false);
        return null;
      }
      return res.json();
    })
    .then(data => {
      if (data) {
        setRaceResults(data);
        setHasOfficialResults(!!data?.p1);
      }
    })
    .catch(err => {
      console.error("Error obteniendo resultados", err);
      setRaceResults(null);
      setHasOfficialResults(false);
    });
}, [nextRace, selectedSeason]);


  // ✅ LOGIN SIMPLE
  if (!currentUser) {
    return (
      <Box sx={{ bgcolor: "#0f0f0f", minHeight: "100vh", px: 2, py: 3, maxWidth: "1000px", mx: "auto", color: "white" }}>
      <LoginForm onSelectPlayer={(user) => selectUser(user)} />
      </Box>
    );
  }

  // ✅ GUARDAR PREDICCIONES
  function handleSavePredictions() {
    if (!nextRace || !currentUser) return;

    fetch(`${API_URL}/save_predictions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          season: nextRace.season,
          round: nextRace.round,
          user: currentUser.name,
          race: nextRace.round,
          predictions: [{
              user: currentUser.name,
              ...editedPredictions[currentUser.name]
          }]
      })
  })
    .then(res => res.json())
    .then(data => {
        alert(data.message || "Predicciones guardadas");
        setIsEditing(false);
    })
    .catch(() => alert("Error al guardar predicciones"));
}


  // ✅ UI PRINCIPAL
  return (
    <Box sx={{ bgcolor: "#0f0f0f", minHeight: "100vh", px: 2, py: 3, maxWidth: "100%", mx: "auto", color: "white" }}>
      <Box mb={3} sx={{ bgcolor: "#191919", px: 2, py: 3, maxWidth: "1000px", mx: "auto", color: "white" }}>
        {/* PODIO */}
        <Podium ranking={leaderboard} />

        <Box mb={3} />

        {/* ÚLTIMA CARRERA */}
        {lastRace && <LastRaceCard race={lastRace} 
        onClick={() => navigate(`/history?season=${selectedSeason}&round=${lastRace.round}`)} />}
      </Box>

      {/* TABLA DE PRÓXIMA CARRERA */}
      <Box mb={2} sx={{ bgcolor: "#191919", minHeight: "10vh", px: 2, py: 3, maxWidth: "1000px", mx: "auto", color: "white" }}>
        <PredictionsTable
          categories={categories}
          predictions={predictions}
          players={["Renato", "Sebastian", "Enrique"]}
          raceResults={raceResults}
          hasOfficialResults={hasOfficialResults}
          drivers={drivers}
          currentUser={currentUser}
          isEditing={isEditing && currentUser?.name !== "admin"}
          setEditedPredictions={setEditedPredictions}
          editedPredictions={editedPredictions}
          handleSavePredictions={handleSavePredictions}
          nextRace={nextRace}
        />

        {currentUser && (
          <Box mt={2} textAlign="center">
           {!isEditing ? (
              <Button variant="outlined" color="primary" onClick={() => {
                const initialEdits = {};
                predictions.forEach(p => {
                  initialEdits[p.user] = { ...p };
                });
                console.log("✅ editedPredictions inicial:", initialEdits);
                setEditedPredictions(initialEdits);
                setIsEditing(true);
              }}>
                Editar Predicciones
              </Button>
            ) : (
              <Button variant="contained" color="success" onClick={() => {
                handleSavePredictions();
                setIsEditing(false); // <- IMPORTANTE cerrar edición después de guardar
              }}>
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
