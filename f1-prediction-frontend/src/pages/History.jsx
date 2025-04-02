// ✅ IMPORTACIONES
import { useState, useEffect } from "react";
import * as React from "react";
import API_URL from "config.js";
import "@fontsource/barlow-condensed";
import { useSearchParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useLoader } from "../context/LoaderContext";
import { Box, Button } from "@mui/material";

// ✅ COMPONENTES
import BottomNavBar from "../components/BottomNavBar";
import PredictionsTable from "../components/PredictionsTable";
import RaceCard from "../components/RaceCard";
import SeasonSelector from "../components/SeasonSelector";
import RaceSelector from "../components/RaceSelector";

export default function History({ setShowSavedMessage, showSavedMessage }) {
  const { currentUser } = useUser();
  const { setLoading } = useLoader();
  const [searchParams] = useSearchParams();
  const [predictions, setPredictions] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [races, setRaces] = useState([]);
  const [raceInfo, setRaceInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPredictions, setEditedPredictions] = useState({});
  const [selectedSeason, setSelectedSeason] = useState(parseInt(searchParams.get("season")) || 2025);
  const [selectedRound, setSelectedRound] = useState(parseInt(searchParams.get("round")) || 1);

  const categories = {
    pole: "POLE", p1: "P1", p2: "P2", p3: "P3", fastest_lap: "FL",
    dnf: "DNF", positions_gained: "POG", positions_lost: "POL",
    best_of_the_rest: "BOR", midfield_master: "MFM"
  };


  // ✅ CARGA INICIAL COMPLETA
  useEffect(() => {
    setLoading(true);
    async function loadAll() {
      try {
        const [seasonsRes, racesRes, driversRes, raceInfoRes, predictionsRes] = await Promise.all([
          fetch(`${API_URL}/get_all_seasons`).then(r => r.json()),
          fetch(`${API_URL}/get_all_races/${selectedSeason}`).then(r => r.json()),
          fetch(`${API_URL}/get_drivers/${selectedSeason}`).then(r => r.json()),
          fetch(`${API_URL}/get_race_info/${selectedSeason}/${selectedRound}`).then(r => r.json()),
          fetch(`${API_URL}/get_race_predictions/${selectedSeason}/${selectedRound}`).then(r => r.json())
        ]);

        setSeasons(seasonsRes.seasons || []);
        setRaces(racesRes.races || []);
        setDrivers(driversRes.drivers || []);
        setRaceInfo(raceInfoRes);
        setPredictions(predictionsRes.predictions || []);

      } catch (err) {
        console.error("Error cargando datos de History", err);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, [selectedSeason, selectedRound, setLoading]);

  // ✅ SAVE PREDICTIONS
  function handleSavePredictions() {
    if (!raceInfo || !editedPredictions) return;
    setLoading(true);

    fetch(`${API_URL}/save_predictions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        season: raceInfo.season,
        round: raceInfo.round,
        race: raceInfo.round,
        predictions: Object.entries(editedPredictions).map(([player, preds]) => ({ user: player, ...preds }))
      })
    })
      .then(res => res.json())
      .then(() => {
        setShowSavedMessage("✅ Predicciones guardadas");
        setTimeout(() => setShowSavedMessage(""), 2000);
        setIsEditing(false);
      })
      .catch(() => alert("Error al guardar predicciones"))
      .finally(() => setLoading(false));
  }

  return (
    <Box sx={{ bgcolor: "#0f0f0f", minHeight: "100vh", px: 2, py: 3, maxWidth: "1000px", mx: "auto", color: "white", pt: 4, pb: 9 }}>

      {/* SELECTORES */}
      <Box mb={2}>
        <SeasonSelector selectedSeason={selectedSeason} seasons={seasons} setSelectedSeason={setSelectedSeason} />
        <RaceSelector races={races} selectedRace={selectedRound} setSelectedRace={setSelectedRound} />
      </Box>

      {/* CARD */}
      {raceInfo && <RaceCard race={raceInfo} />}

      {/* TABLE */}
      {currentUser?.isAdmin && isEditing && (
        <Button onClick={handleSavePredictions} variant="contained" size="small" sx={{ mb: 1 }}>
          Guardar Cambios
        </Button>
      )}
      <PredictionsTable
        categories={categories}
        predictions={predictions}
        players={["Renato", "Sebastian", "Enrique"]}
        drivers={drivers}
        currentUser={currentUser}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editedPredictions={editedPredictions}
        setEditedPredictions={setEditedPredictions}
      />

      {showSavedMessage && (
        <Box sx={{ bgcolor: "#22c55e", color: "white", p: 1, borderRadius: 1, textAlign: "center", mb: 2 }}>
          ✅ Predicciones guardadas
        </Box>
      )}

      <BottomNavBar />
    </Box>
  );
}
