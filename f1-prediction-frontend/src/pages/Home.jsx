// ✅ IMPORTACIONES
import { useState, useEffect, useCallback } from "react";
import * as React from "react";
import API_URL from "config.js";
import "@fontsource/barlow-condensed";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; 
import { useLoader } from "../context/LoaderContext";
import { Box, Button } from "@mui/material";

// ✅ COMPONENTES
import BottomNavBar from "../components/BottomNavBar";
import Podium from "components/Podium";
import PredictionsTable from "components/PredictionsTable";
import LoginForm from "components/LoginForm";
import LastRaceCard from "../components/LastRaceCard";
import useRaceData from "../hooks/useRaceData";

// ✅ HOME
export default function Home({ setShowSavedMessage }) {
  const [selectedSeason, setSelectedSeason] = useState(2025);
  const [leaderboard, setLeaderboard] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const { currentUser, selectUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPredictions, setEditedPredictions] = useState({});
  const navigate = useNavigate();
  const { lastRace, nextRace } = useRaceData(selectedSeason);
  const [raceResults, setRaceResults] = useState({});
  const [hasOfficialResults, setHasOfficialResults] = useState(false);
  const { setLoading } = useLoader();

  // ✅ CATEGORIES
  const categories = {
    pole: "POLE", 
    p1: "P1", 
    p2: "P2", 
    p3: "P3", 
    fastest_lap: "FL",
    dnf: "DNF", 
    positions_gained: "POG", 
    positions_lost: "POL",
    best_of_the_rest: "BOR", 
    midfield_master: "MFM"
  };

  // ✅ LOADER CONTROL
  const [isDataLoaded, setIsDataLoaded] = useState(false);

 // ✅ CARGA INICIAL CON PREDICTIONS Y RESULTS
useEffect(() => {
  setLoading(true);
  async function loadAll() {
      setLoading(true);
      try {
          const seasonRes = await fetch(`${API_URL}/get_latest_season`).then(r => r.json());
          if (seasonRes.latest_season) setSelectedSeason(parseInt(seasonRes.latest_season));

          const [driversRes, leaderboardRes] = await Promise.all([
              fetch(`${API_URL}/get_drivers/${seasonRes.latest_season}`).then(r => r.json()),
              fetch(`${API_URL}/leaderboard`).then(r => r.json())
          ]);

          setDrivers(driversRes.drivers || []);
          setLeaderboard(leaderboardRes);

          // solo cargar predicciones y resultados si hay nextRace
          if (nextRace) {
              const [predictionsRes, resultsRes] = await Promise.all([
                  fetch(`${API_URL}/get_race_predictions/${seasonRes.latest_season}/${nextRace.round}`).then(r => r.json()),
                  fetch(`${API_URL}/get_race_results/${seasonRes.latest_season}/${nextRace.round}`).then(r => r.status === 404 ? null : r.json())
              ]);

              setPredictions(predictionsRes.predictions || []);
              setRaceResults(resultsRes || null);
              setHasOfficialResults(!!resultsRes?.p1);
          }

      } catch (err) {
          console.error("Error cargando datos", err);
      } finally {
          setIsDataLoaded(true);
          setLoading(false);
      }
  }

  if (nextRace) {
      loadAll();
  }

}, [setLoading, nextRace]);

  // ✅ LOAD PREDICTIONS
  const loadPredictions = useCallback(() => {
    if (!nextRace) return;
    fetch(`${API_URL}/get_race_predictions/${selectedSeason}/${nextRace.round}`)
      .then((res) => res.json())
      .then((data) => setPredictions(data.predictions || []));
  }, [nextRace, selectedSeason]);

  useEffect(() => {
    if (isDataLoaded) loadPredictions();
  }, [isDataLoaded, loadPredictions]);

  // ✅ LOAD RESULTS
  useEffect(() => {
    if (!nextRace || !nextRace.round) return;
    fetch(`${API_URL}/get_race_results/${selectedSeason}/${nextRace.round}`)
      .then(res => res.status === 404 ? null : res.json())
      .then(data => {
        setRaceResults(data || null);
        setHasOfficialResults(!!data?.p1);
      })
      .catch(() => {
        setRaceResults(null);
        setHasOfficialResults(false);
      });
  }, [nextRace, selectedSeason]);

  // ✅ LOGIN
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
    setLoading(true);

    fetch(`${API_URL}/save_predictions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        season: nextRace.season,
        round: nextRace.round,
        user: currentUser.name,
        race: nextRace.round,
        predictions: [{ user: currentUser.name, ...editedPredictions[currentUser.name] }]
      })
    })
    .then(res => res.json())
    .then(() => {
      loadPredictions();
      setShowSavedMessage("✅ Predicciones guardadas");
      setTimeout(() => setShowSavedMessage(""), 3000);
      setIsEditing(false);
    })
    .catch(() => {
      setShowSavedMessage("❌ Error al guardar predicciones");
      setTimeout(() => setShowSavedMessage(""), 3500);
    })
    .finally(() => setLoading(false));
  }

  // ✅ UI PRINCIPAL
  return (
    <Box sx={{ bgcolor: "#0f0f0f", minHeight: "100vh", px: 2, py: 3, maxWidth: "100%", mx: "auto", color: "white", pt: 4, pb: 9 }}>
        <Podium ranking={leaderboard} />
        <Box mb={3} />
        {lastRace && <LastRaceCard race={lastRace} onClick={() => navigate(`/history?season=${selectedSeason}&round=${lastRace.round}`)} />}

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
                predictions.forEach(p => { initialEdits[p.user] = { ...p }; });
                setEditedPredictions(initialEdits);
                setIsEditing(true);
              }}>
                Editar Predicciones
              </Button>
            ) : (
              <Button variant="contained" color="success" onClick={handleSavePredictions}>
                Guardar Predicciones
              </Button>
            )}
          </Box>
        )}

        <BottomNavBar />
    </Box>
  );
}
