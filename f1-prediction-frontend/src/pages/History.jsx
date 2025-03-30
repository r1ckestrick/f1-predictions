import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import API_URL from "../config";
import PredictionsTable from "../components/PredictionsTable";
import { Box, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import BottomNavBar from "../components/BottomNavBar";  // Asegúrate de que esta línea esté presente


export default function History() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [season, setSeason] = useState(parseInt(searchParams.get("season")) || 2025);
  const [race, setRace] = useState(parseInt(searchParams.get("round")) || 1);
  const [seasons, setSeasons] = useState([]);
  const [races, setRaces] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [raceResults, setRaceResults] = useState({});
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/get_latest_season`)
      .then((res) => res.json())
      .then((data) => {
        const latest = parseInt(data.latest_season || 2025);
        setSeasons(Array.from({ length: latest - 2000 + 1 }, (_, i) => 2000 + i).reverse());
      });
  }, []);

  useEffect(() => {
    if (!season) return;
    fetch(`${API_URL}/get_all_races/${season}`)
      .then((res) => res.json())
      .then((data) => {
        setRaces(data.races || []);
      });
    fetch(`${API_URL}/get_drivers/${season}`)
      .then((res) => res.json())
      .then((data) => setDrivers(data.drivers || []));
  }, [season]);

  useEffect(() => {
    if (!season || !race) return;
    fetch(`${API_URL}/get_race_predictions/${season}/${race}`)
      .then((res) => res.json())
      .then((data) => setPredictions(data.predictions || []));
    fetch(`${API_URL}/get_race_info/${season}/${race}`)
      .then((res) => res.json())
      .then((data) => setRaceResults(data || {}));
  }, [season, race]);

  return (
    <Box sx={{ bgcolor: "#0f0f0f", minHeight: "100vh", px: 2, py: 3, maxWidth: "1000px", mx: "auto", color: "white" }}>
      <Typography variant="h6" mb={2}>Historial de Predicciones</Typography>

      {/* Selección de temporada y carrera */}
      <Box display="flex" gap={2} mb={3}>
        <FormControl fullWidth>
          <InputLabel>Temporada</InputLabel>
          <Select
            value={season}
            label="Temporada"
            onChange={(e) => { setSeason(e.target.value); setRace(1); }}
          >
            {seasons.map((y) => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Carrera</InputLabel>
          <Select
            value={race}
            label="Carrera"
            onChange={(e) => setRace(e.target.value)}
          >
            {races.map((r) => (
              <MenuItem key={r.round} value={parseInt(r.round)}>{r.raceName}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Información de la carrera seleccionada */}
      {raceResults?.raceName && (
        <Box mb={3} sx={{ bgcolor: "#1c1c1e", borderRadius: 2, boxShadow: "0 0 4px rgba(255,255,255,0.05)", p: 2 }}>
          <Typography variant="h6" color="white" sx={{ fontFamily: "'Barlow Condensed'" }}>
            {raceResults.raceName}
          </Typography>
          <Typography variant="body1" color="white" sx={{ fontFamily: "'Barlow Condensed'" }}>
            Fecha: {raceResults.date || "Cargando..."}
          </Typography>
        </Box>
      )}

      {/* Tabla de predicciones */}
      <PredictionsTable
        categories={{
          pole: "POLE",
          p1: "P1",
          p2: "P2",
          p3: "P3",
          fastest_lap: "FL",
          dnf: "DNF",
          positions_gained: "POG",
          positions_lost: "POL",
          best_of_the_rest: "BOR",
          midfield_master: "MFM",
        }}
        predictions={predictions}
        players={[...new Set(predictions.map((p) => p.user))]}
        raceResults={raceResults}
        drivers={drivers}
        currentUser={null}
        isEditing={false}
        setEditedPredictions={() => {}}
        editedPredictions={{}}
        handleSavePredictions={() => {}}
        hasOfficialResults={true}
        nextRace={null}
      />

      {/* Asegúrate de tener el BottomNavBar al final */}
      <BottomNavBar />
    </Box>
  );
}
