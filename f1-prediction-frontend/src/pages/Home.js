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
import LoginForm from "components/LoginForm";
import { Box, Typography, Button, Paper } from "@mui/material";
import SeasonSelector from "components/SeasonSelector";


// ✅ ASSETS
import f1Logo from "assets/images/f1-logo-white.png";

// ✅ MOCK O UTIL LOCAL





// ✅ MAIN COMPONENT
export default function App() {
  // --- ESTADO GLOBAL ---
  const [selectedRace, setSelectedRace] = useState("");
  const [races, setRaces] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [raceResults, setRaceResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [totalHits, setTotalHits] = useState(0);
  const [winner, setWinner] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPredictions, setEditedPredictions] = useState({});
  const [raceInfo, setRaceInfo] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(2025); 
  const [availableSeasons, setAvailableSeasons] = useState([]);
  const [drivers, setDrivers] = useState([]);

  // --- UTILIDADES ---
  const generateSeasonList = (latest) => {
    const startYear = 2010; // puedes cambiar este año si quieres más o menos temporadas
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

  const calculatePoints = (player) => {
    if (!player || !raceResults) return 0;
    let basePoints = 0;
    let bonusCount = 0;

    Object.keys(raceResults).forEach((key) => {
      if (raceResults[key] === player[key]) basePoints += 40;
    });

    const bonuses = checkBonuses(player);
    if (bonuses.bullseye) bonusCount++;
    if (bonuses.hatTrick) bonusCount++;
    if (bonuses.udimpo) bonusCount++;
    if (bonuses.podium) bonusCount++;

    let bonusPoints = bonusCount * 50;
    let multiplier = [1, 1, 1.1, 1.2, 1.3][bonusCount] || 1;
    let totalPoints = (basePoints + bonusPoints) * multiplier;

    if (bonusCount === 4 && basePoints === 400) totalPoints += 200;
    return Math.round(totalPoints);
  };

  const checkBonuses = (player) => {
    if (!player || !raceResults) return {};
    const correctPicks = Object.keys(raceResults).filter((key) => raceResults[key] === player[key]).length;
    const correctPodium = ["p1", "p2", "p3"].every((pos) => player[pos] && Object.values(raceResults).includes(player[pos]));
    const correctPodiumOrder = ["p1", "p2", "p3"].every((pos) => raceResults[pos] === player[pos]);
    const correctHatTrick = ["pole", "p1", "fastest_lap"].every((pos) => raceResults[pos] === player[pos]);
    const correctBullseye = ["p4", "p5", "p6", "p7", "p8", "p9", "p10"].some((pos) => raceResults[pos] === player[pos]);

    return {
      udimpo: correctPodium,
      bullseye: correctBullseye,
      podium: correctPodiumOrder,
      hatTrick: correctHatTrick,
      omen: correctPicks === Object.keys(raceResults).length,
    };
  };

  // --- FETCHS (pueden moverse a services luego) ---
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
          setSelectedSeason(currentYear); // esto asegura que empieces en la más actual
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
    fetch(`${API_URL}/get_race_predictions/${selectedSeason}/${selectedRace}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📊 Predicciones recibidas:", data.predictions);
        if (data.predictions) setPredictions(data.predictions);
        else setPredictions([]);
      })
      .catch(() => setPredictions([]));
  }, [selectedSeason, selectedRace]);

  useEffect(() => {
    let maxHits = 0;
    let roundWinner = "";
    let total = 0;

    predictions.forEach((player) => {
      const count = Object.keys(raceResults).filter((key) => raceResults[key] === player[key]).length;
      total += count;
      if (count > maxHits) {
        maxHits = count;
        roundWinner = player.user;
      }
    });

    setTotalHits(total);
    setWinner(roundWinner);
  }, [predictions, raceResults]);

  useEffect(() => {
    if (!selectedRace || !selectedSeason) return;
  
    fetch(`${API_URL}/get_race_results/${selectedSeason}/${selectedRace}`)
      .then((res) => res.json())
      .then((data) => {
        const summary = {
          pole: data.pole_position || "N/A",
          p1: data.winner || "N/A",
          fastest_lap: data.fastest_lap || "N/A",
          // Puedes seguir agregando si extraes más datos del backend
        };
  
        console.log("🏁 Resultados reales:", summary);
        setRaceResults(summary);
      })
      .catch((error) => {
        console.error("❌ Error al cargar resultados de carrera:", error);
        setRaceResults({});
      });
  }, [selectedSeason, selectedRace]);
  

  const handleLogin = (username, password) => {
    const users = {
      Renato: "1234",
      Sebastian: "5678",
      Enrique: "91011",
    };
  
    if (users[username] && users[username] === password) {
      setCurrentUser(username);
      setIsLoggedIn(true);
    } else {
      alert("Usuario o contraseña incorrectos");
    }
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
  
        // 🟢 Aquí vuelves a pedir las predicciones para que se actualicen
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
    return <LoginForm onLogin={handleLogin} />;
  }
  

  return (
    <Box sx={{ 
      px: { xs: 2, sm: 4 }, 
      py: 4, 
      maxWidth: "1200px", 
      mx: "auto", 
      textAlign: "center", marginBottom: "80px", // 👈 esto crea espacio para la BottomNavBar
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
        totalHits={totalHits}
        winner={winner}
        calculatePoints={calculatePoints}
        checkBonuses={checkBonuses}
        handleSavePredictions={handleSavePredictions}
      
      />

      <BottomNavBar />
    </Box>
  );
}
