// ✅ IMPORTACIONES
import { useState, useEffect, useCallback } from "react";
import API_URL from "config.js";
import * as React from "react";

// ✅ COMPONENTES
import BottomNavBar from "../components/BottomNavBar";
import Podium from "components/Podium";
import RaceInfoCard from "components/RaceInfoCard";
import RaceSelector from "components/RaceSelector";
import PredictionsTable from "components/PredictionsTable";
import { Box, Typography, Button, Paper } from "@mui/material";
import SeasonSelector from "components/SeasonSelector";

// ✅ ASSETS
import f1Logo from "assets/images/f1-logo-white.png";

// ✅ MAIN COMPONENT
export default function App() {
  const [selectedRace, setSelectedRace] = useState("");
  const [races, setRaces] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [raceResults, setRaceResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPredictions, setEditedPredictions] = useState({});
  const [raceInfo, setRaceInfo] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(2025);
  const [availableSeasons, setAvailableSeasons] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [hasOfficialResults, setHasOfficialResults] = useState(true);


  const generateSeasonList = (latest) => {
    const startYear = 2010;
    return Array.from({ length: latest - startYear + 1 }, (_, i) => latest - i);
  };

  const generateCircuitId = (circuitName) => circuitName?.toLowerCase().replace(/ /g, "_") || "unknown";

  const categories = {
    pole: "POLE",
    p1: "P1",
    p2: "P2",
    p3: "P3",
    positions_gained: "POG",
    positions_lost: "POL",
    fastest_lap: "FL",
    dnf: "DNF",
    best_of_the_rest: "BOR",
    midfield_master: "MFM",
    bullseye: "BULLSEYE",
    hatTrick: "HATTRICK",
    udimpo: "UDIMPO",
    podium: "PODIUM",
    omen: "OMEN",
  };

  const players = ["Renato", "Sebastian", "Enrique"];

  const fetchDrivers = useCallback(() => {
    fetch(`${API_URL}/get_drivers/${selectedSeason}`)
      .then((res) => res.json())
      .then((data) => setDrivers(data.drivers || []))
      .catch(() => setDrivers([]));
  }, [selectedSeason]);

  useEffect(() => {
    fetch(`${API_URL}/get_latest_season`)
      .then((res) => res.json())
      .then((data) => {
        if (data.latest_season) {
          const currentYear = parseInt(data.latest_season);
          const years = generateSeasonList(currentYear);
          setAvailableSeasons(years);
          setSelectedSeason(currentYear);
        }
      });
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/get_all_races/${selectedSeason}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.races?.length) {
          setRaces([...data.races]);
          setSelectedRace(data.races[0].round);
        }
      })
      .finally(() => setLoading(false));
  }, [selectedSeason]);

  useEffect(() => {
    fetch(`${API_URL}/leaderboard`)
      .then((res) => res.json())
      .then((data) => setLeaderboard(data));
  }, [selectedSeason]);

  useEffect(() => {
    fetchDrivers();
  }, [selectedSeason, fetchDrivers]);

  useEffect(() => {
    if (!selectedRace || !selectedSeason) return;
    fetch(`${API_URL}/get_race_info/${selectedSeason}/${selectedRace}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.raceName) {
          setRaceInfo({
            raceName: data.raceName,
            date: data.date,
            Circuit: {
              circuitId: data.Circuit?.circuitId || generateCircuitId(data.Circuit?.circuitName),
              circuitName: data.Circuit?.circuitName,
              Location: { country: data.Circuit?.Location?.country },
            },
            Results: data.Results || [],
          });
        }
      });
  }, [selectedRace, selectedSeason]);

  useEffect(() => {
    if (!selectedSeason || !selectedRace) return;
    const predictionsUrl = `${API_URL}/get_race_predictions/${selectedSeason}/${selectedRace}`;
    console.log("🌐 Fetching predictions from:", predictionsUrl);
  
    fetch(predictionsUrl)
      .then((res) => {
        if (!res.ok) {
          console.error(`❌ API returned status ${res.status} for predictions endpoint`);
          if (res.status === 404) {
            console.warn("⚠️ Predictions not found for the selected race and season.");
            setPredictions([]);
            setHasOfficialResults(false); // <-- ❌ No hay resultados
            return null;
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.predictions) {
          console.log("📊 Predicciones recibidas:", data.predictions);
          setPredictions(data.predictions);
  
          // ✅ Revisamos si hay resultados calculados (points)
          const first = data.predictions[0];
          if (first && first.points == null) {
            setHasOfficialResults(false); // ⛔️ Aún no hay resultados oficiales
          } else {
            setHasOfficialResults(true); // ✅ Sí hay resultados
          }
        }
      })
      .catch((error) => {
        console.error("❌ Error fetching race predictions:", error);
        setPredictions([]);
        setHasOfficialResults(false);
      });
  }, [selectedSeason, selectedRace]);
  

  useEffect(() => {
    if (!selectedRace || !selectedSeason) return;

    fetch(`${API_URL}/get_race_results/${selectedSeason}/${selectedRace}`)
      .then((res) => res.json())
      .then((data) => {
        const summary = {
          pole: data.pole || "N/A",
          p1: data.p1 || "N/A",
          p2: data.p2 || "N/A",
          p3: data.p3 || "N/A",
          fastest_lap: data.fastest_lap || "N/A",
          positions_gained: data.positions_gained || "N/A",
          positions_lost: data.positions_lost || "N/A",
          dnf: data.dnf || [],
          best_of_the_rest: data.best_of_the_rest || [],
          midfield_master: data.midfield_master || []
        };

        console.log("🏁 Resultados reales:", summary);
        setRaceResults(summary);
      })
      .catch((error) => {
        console.error("❌ Error al cargar resultados de carrera:", error);
        setRaceResults({});
      });
  }, [selectedSeason, selectedRace]);

  const handleSelectPlayer = (playerName) => {
    setCurrentUser(playerName);
    setIsLoggedIn(true);
  };

  const handleSavePredictions = () => {
    fetch(`${API_URL}/save_predictions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: currentUser,
        race: selectedRace,
        season: selectedSeason,
        predictions: editedPredictions[currentUser],
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("✅ Predicción guardada!");

        fetch(`${API_URL}/get_race_predictions/${selectedSeason}/${selectedRace}`)
          .then((res) => res.json())
          .then((data) => {
            setPredictions(data.predictions);
          });

        setIsEditing(false);
      })
      .catch(() => alert("❌ Error guardando predicciones"));
  };

  if (!isLoggedIn) {
    return (
      <Box mt={4} textAlign="center">
        <Typography variant="h6" gutterBottom>Selecciona tu jugador</Typography>
        <Box display="flex" flexDirection="column" gap={2} alignItems="center">
          {players.map((player) => (
            <Button
              key={player}
              variant="contained"
              onClick={() => handleSelectPlayer(player)}
            >
              {player}
            </Button>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{
      px: { xs: 2, sm: 4 },
      py: 4,
      maxWidth: "1200px",
      mx: "auto",
      textAlign: "center", marginBottom: "80px",
    }}>
      <Paper elevation={4} sx={{ p: 4, backgroundColor: "red" }}>
        <img src={f1Logo} alt="logo" width={100} />
        <Typography variant="h5" gutterBottom color="white" fontFamily="fantasy">
          Prediction Party F1
        </Typography>
      </Paper>

      <Box py={3}><Podium ranking={leaderboard} /></Box>

      <Box mb={3} textAlign="center">
        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2} justifyContent="center">
          <SeasonSelector
            selectedSeason={selectedSeason}
            seasons={availableSeasons}
            setSelectedSeason={setSelectedSeason}
          />
          <RaceSelector
            selectedRace={selectedRace}
            races={races}
            setSelectedRace={setSelectedRace}
          />
        </Box>
      </Box>

      {loading ? <Typography>Cargando datos...</Typography> : <RaceInfoCard raceInfo={raceInfo} selectedRace={selectedRace} />}

      <Box mt={2} mb={3}>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant="contained"
          color={isEditing ? "error" : "primary"}
        >
          {isEditing ? "Cancelar Edición" : "Editar Predicción"}
        </Button>
      </Box>

      <PredictionsTable
        categories={categories}
        predictions={predictions}
        players={players}
        raceResults={raceResults}
        currentUser={currentUser}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editedPredictions={editedPredictions}
        setEditedPredictions={setEditedPredictions}
        drivers={drivers}
        totalHits={0}
        winner={""}
        handleSavePredictions={handleSavePredictions}
        hasOfficialResults={hasOfficialResults}
      />

      <BottomNavBar />
    </Box>
  );
}
