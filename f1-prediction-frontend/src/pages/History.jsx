import { useState, useEffect } from "react";
import * as React from "react";
import API_URL from "config.js";
import "@fontsource/barlow-condensed";
import { useSearchParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import useRaceResults from "../hooks/useRaceResults";
import { Box, Button } from "@mui/material";

// COMPONENTES
import BottomNavBar from "../components/BottomNavBar";
import PredictionsTable from "../components/PredictionsTable";
import RaceCard from "../components/RaceCard";
import SeasonSelector from "../components/SeasonSelector";
import RaceSelector from "../components/RaceSelector";
import AdminToggle from "../components/AdminToggle";

export default function History() {
  const { currentUser } = useUser();
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
  const { raceResults, hasOfficialResults } = useRaceResults(selectedSeason, selectedRound);

  const categories = {
    pole: "POLE", p1: "P1", p2: "P2", p3: "P3", fastest_lap: "FL",
    dnf: "DNF", positions_gained: "POG", positions_lost: "POL",
    best_of_the_rest: "BOR", midfield_master: "MFM"
  };

  // ✅ LOAD SEASONS
  useEffect(() => {
    fetch(`${API_URL}/get_all_seasons`)
      .then((res) => res.json())
      .then((data) => setSeasons(data.seasons || []));
  }, []);

  // ✅ LOAD RACES
  useEffect(() => {
    if (!selectedSeason) return;
    fetch(`${API_URL}/get_all_races/${selectedSeason}`)
      .then((res) => res.json())
      .then((data) => setRaces(data.races || []));
  }, [selectedSeason]);

  // ✅ LOAD RACE INFO
  useEffect(() => {
    if (!selectedSeason || !selectedRound) return;
    fetch(`${API_URL}/get_race_info/${selectedSeason}/${selectedRound}`)
      .then((res) => res.json())
      .then((data) => setRaceInfo(data));
  }, [selectedSeason, selectedRound]);

  // ✅ LOAD DRIVERS
  useEffect(() => {
    if (!selectedSeason) return;
    fetch(`${API_URL}/get_drivers/${selectedSeason}`)
      .then((res) => res.json())
      .then((data) => setDrivers(data.drivers || []));
  }, [selectedSeason]);

  // ✅ LOAD PREDICTIONS
  useEffect(() => {
    if (!selectedSeason || !selectedRound) return;
    fetch(`${API_URL}/get_race_predictions/${selectedSeason}/${selectedRound}`)
      .then((res) => res.json())
      .then((data) => setPredictions(data.predictions || []));
  }, [selectedSeason, selectedRound]);

  // ✅ SAVE PREDICTIONS
  function handleSavePredictions() {
    if (!raceInfo || !editedPredictions) return;

    fetch(`${API_URL}/save_predictions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        season: raceInfo.season,
        round: raceInfo.round,
        race: raceInfo.round,
        predictions: Object.entries(editedPredictions).map(([player, preds]) => ({
          user: player,
          ...preds
        }))
      })
    })
      .then(res => res.json())
      .then(data => alert(data.message || "Predicciones guardadas"))
      .catch(() => alert("Error al guardar predicciones"));
  }

  return (
    <Box sx={{ bgcolor: "#0f0f0f", minHeight: "100vh", px: 2, py: 3, maxWidth: "1000px", mx: "auto", color: "white" }}>

      {/* SELECTORES */}
      <Box mb={2}>
        <SeasonSelector selectedSeason={selectedSeason} seasons={seasons} setSelectedSeason={setSelectedSeason} />
        <RaceSelector races={races} selectedRace={selectedRound} setSelectedRace={setSelectedRound} />
      </Box>

      {/* CARD */}
      {raceInfo && <RaceCard race={raceInfo} />}

      {/* TABLE */}
      <Box mb={2} sx={{ bgcolor: "#191919", minHeight: "10vh", px: 2, py: 3, maxWidth: "1000px", mx: "auto", color: "white" }}>
        {currentUser?.isAdmin && isEditing && (
          <Button onClick={handleSavePredictions} variant="contained" size="small" sx={{ mb: 1 }}>
            Guardar Cambios
          </Button>
        )}
        <PredictionsTable
          categories={categories}
          predictions={predictions}
          players={["Renato", "Sebastian", "Enrique"]}
          raceResults={raceResults}
          hasOfficialResults={hasOfficialResults}
          drivers={drivers}
          currentUser={currentUser}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editedPredictions={editedPredictions}
          setEditedPredictions={setEditedPredictions}
        />
      </Box>

      <BottomNavBar />
    </Box>
  );
}
