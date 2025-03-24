import { useState, useEffect, useCallback } from "react";
import API_URL from "./config.js";
import * as React from "react";
import BottomNavBar from "./components/BottomNavBar.jsx";
import f1Logo from "./assets/images/f1-logo-white.png";
import Podium from "./pages/Podium.jsx";
import RaceDetails from "./pages/RaceDetails.jsx";
import {
  Container,
  FormControl,
  Box,
  MenuItem,
  Typography,
  TextField,
  InputLabel,
  Button,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
} from "@mui/material";

export default function App() {
  const [selectedRace, setSelectedRace] = useState("");
  const [races, setRaces] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [raceResults, setRaceResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [totalHits, setTotalHits] = useState(0);
  const [winner, setWinner] = useState("");
  const [currentUser, setCurrentUser] = useState(""); // Usuario logueado
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Indica si está autenticado
  const [isEditing, setIsEditing] = useState(false); // Modo edición activado/desactivado
  const [editedPredictions, setEditedPredictions] = useState({}); // Almacena las ediciones
  const [raceInfo, setRaceInfo] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("2025"); // Ahora sí cambia
  const [season, setSeason] = useState("2025"); // Ahora sí cambia
  const [availableSeasons, setAvailableSeasons] = useState([]);

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

  const calculatePoints = (player) => {
    if (!player || !raceResults) return 0;

    let basePoints = 0;
    let bonusCount = 0;

    // ✅ Verificar aciertos
    Object.keys(raceResults).forEach((key) => {
      if (raceResults[key] === player[key]) {
        basePoints += 40; // Cada acierto vale 40 puntos
      }
    });

    // ✅ Verificar bonos activados
    const bonuses = checkBonuses(player);
    if (bonuses.bullseye) bonusCount++;
    if (bonuses.hatTrick) bonusCount++;
    if (bonuses.udimpo) bonusCount++;
    if (bonuses.podium) bonusCount++;

    // Cada bono activo suma 50 puntos
    let bonusPoints = bonusCount * 50;

    // ✅ Aplicar multiplicadores según la cantidad de bonos activados
    let multiplier = 1;
    if (bonusCount === 2) multiplier = 1.1;
    if (bonusCount === 3) multiplier = 1.2;
    if (bonusCount === 4) multiplier = 1.3; // Máximo de 4 bonos

    // ✅ Aplicar el multiplicador
    let totalPoints = (basePoints + bonusPoints) * multiplier;

    // ✅ Si obtiene OMEN (todos los aciertos + todos los bonos), sumar 200 puntos extra
    if (bonusCount === 4 && basePoints === 400) {
      totalPoints += 200;
    }

    return Math.round(totalPoints); // Redondeamos para evitar decimales
  };

  const players = ["Renato", "Sebastian", "Enrique"];

  const [drivers, setDrivers] = useState([]); // 🔥 Siempre empieza como array vacío

  const fetchDrivers = useCallback(() => {
    fetch(`${API_URL}/get_drivers/${selectedSeason}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📊 Pilotos obtenidos:", data); // 🔍 Ver qué llega
        setDrivers(data.drivers || []); // 💡 Asegurar que siempre sea un array
      })
      .catch((error) => {
        console.error("❌ Error al obtener pilotos:", error);
        setDrivers([]); // ⚠️ En caso de error, asignar un array vacío
      });
  }, [selectedSeason]);

  useEffect(() => {
    console.log("🌍 Buscando carreras para la temporada:", selectedSeason);
    if (!selectedSeason) return; // Evita errores si aún no se ha seleccionado una temporada
    fetch(`${API_URL}/get_all_races/${selectedSeason}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("🛠️ Verificando carreras:", data); // 🔍 Verifica qué viene realmente
        if (data.races?.length) {
          // 👀 Usa `?.` para evitar errores si `races` es undefined
          console.log("✅ Carreras detectadas:", data.races);
          setRaces([...data.races]); // 👈 Asegura que React detecte el cambio
          setSelectedRace(data.races[0].round);
        } else {
          console.log("❌ No se encontraron carreras en la API.");
        }
      })
      .catch((error) =>
        console.error("Error al obtener lista de carreras:", error)
      )
      .finally(() => setLoading(false));
  }, [selectedSeason]); // Solo depende de selectedSeason

  useEffect(() => {
    fetch(`${API_URL}/leaderboard`)
      .then((res) => res.json())
      .then((data) => {
        setLeaderboard(data);
        console.log("LEADERBOARD: ", data);
      })
      .catch((error) => console.error("Error obteniendo leaderboard:", error));
  }, [selectedSeason]);

  useEffect(() => {
    fetchDrivers(); // 📌 Llamamos a la función que obtiene los pilotos
  }, [selectedSeason, fetchDrivers]); // ⚠️ Aquí agregamos selectedSeason como dependencia

  useEffect(() => {
    fetch(`${API_URL}/get_latest_season`)
      .then((res) => res.json())
      .then((data) => {
        if (data.latest_season) {
          const latest = parseInt(data.latest_season);
          setSelectedSeason(latest);
          setAvailableSeasons(
            Array.from({ length: latest - 2010 }, (_, i) => latest - i)
          ); // Genera años desde 2010 hasta la última
        }
      })
      .catch((err) => console.error("Error obteniendo las temporadas:", err));
  }, [setSelectedSeason]);

  useEffect(() => {
    if (!selectedSeason) return; // Evita errores si aún no se ha seleccionado una temporada
    fetch(`${API_URL}/get_all_races/${selectedSeason}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.races && data.races.length > 0) {
          console.log("Temporada seleccionada:", selectedSeason);
          setRaces(data.races);
          if (!selectedRace) {
            // ❗ Solo cambia si no hay una carrera seleccionada
            setSelectedRace(data.races[0].round);
          }
        }
      })
      .catch((error) =>
        console.error("Error al obtener lista de carreras:", error)
      )
      .finally(() => setLoading(false));
  }, [selectedSeason, selectedRace]); // ✅ Aquí está bien, React debería dejar de quejarse

  useEffect(() => {
    if (!selectedRace) return;

    fetch(`${API_URL}/get_race_info/${selectedSeason}/${selectedRace}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.raceName) {
          console.log("🏎️ Info de la carrera recibida:", data); // 🔍 Verificar la respuesta
          setRaceInfo({
            name: data.raceName,
            circuit: data.circuitName,
            date: data.date,
            imageUrl: data.mapImage || "",
            status: data.status || "En Curso",
          });

          // 🛠️ Imprimir en consola lo que recibe raceInfo
          console.log("Información de la carrera:", data);
        }
      })
      .catch((error) => {
        console.error("🚨 Error obteniendo info de la carrera:", error);
        setRaceInfo(null);
      });

    fetch(`${API_URL}/get_race_results/${selectedSeason}/${selectedRace}`)
      .then((res) => (res.ok ? res.json() : {}))
      .then((data) => {
        if (data.MRData && data.MRData.RaceTable.Races.length > 0) {
          const raceData = data.MRData.RaceTable.Races[0];

          setRaceInfo({
            name: raceData.raceName,
            round: raceData.round,
            date: raceData.date,
            circuit: raceData.Circuit.circuitName,
            location: `${raceData.Circuit.Location.locality}, ${raceData.Circuit.Location.country}`,
            map: raceData.Circuit.url.replace(
              "https://www.",
              "https://maps.google.com/?q="
            ), // Convierte el link de F1 en un mapa de Google
          });

          const processedResults = {
            pole: raceData.Results?.[0]?.Driver?.code || "-",
            p1: raceData.Results?.[0]?.Driver?.code || "-",
            p2: raceData.Results?.[1]?.Driver?.code || "-",
            p3: raceData.Results?.[2]?.Driver?.code || "-",
            positions_gained: "-",
            positions_lost: "-",
            fastest_lap:
              raceData.Results?.find((r) => r.FastestLap)?.Driver?.code || "-",
            dnf:
              raceData.Results?.find((r) => r.status !== "Finished")?.Driver
                ?.code || "-",
            best_of_the_rest: "-",
            midfield_master: "-",
          };

          setRaceResults(processedResults);
        } else {
          setRaceResults({});
        }
      })
      .catch(() => setRaceResults({}))
      .finally(() => setLoading(false));
  }, [selectedRace, selectedSeason]); // ✅ Aquí está bien, React debería dejar de quejarse

  useEffect(() => {
    if (!selectedSeason || !selectedRace) return; // Evita errores si aún no se ha seleccionado algo

    fetch(`${API_URL}/get_race_predictions/${selectedSeason}/${selectedRace}`) // 🔥 Llama a la API corregida
      .then((res) => res.json())
      .then((data) => {
        if (data.predictions) {
          console.log("📊 Predicciones recibidas:", data);
          setPredictions(data.predictions); // ✅ Guarda solo las predicciones de la carrera seleccionada
        } else {
          console.error("❌ Error obteniendo predicciones:", data.error);
          setPredictions([]);
        }
      })
      .catch(() => setPredictions([]));
  }, [selectedSeason, selectedRace]); // ⚡ Ahora depende del año Y la carrera

  useEffect(() => {
    let maxHits = 0;
    let roundWinner = "";
    let total = 0;

    predictions.forEach((player) => {
      let count = Object.keys(raceResults).filter(
        (key) => raceResults[key] === player[key]
      ).length;
      total += count;

      if (count > maxHits) {
        maxHits = count;
        roundWinner = player.user;
      }
    });

    setTotalHits(total);
    setWinner(roundWinner);
  }, [predictions, raceResults]);

  const checkBonuses = (player) => {
    if (!player || !raceResults) return {};

    const correctPicks = Object.keys(raceResults).filter(
      (key) => raceResults[key] === player[key]
    ).length;
    const correctPodium = ["p1", "p2", "p3"].every(
      (pos) => player[pos] && Object.values(raceResults).includes(player[pos])
    );
    const correctPodiumOrder = ["p1", "p2", "p3"].every(
      (pos) => raceResults[pos] === player[pos]
    );
    const correctHatTrick = ["pole", "p1", "fastest_lap"].every(
      (pos) => raceResults[pos] === player[pos]
    );
    const correctBullseye = ["p4", "p5", "p6", "p7", "p8", "p9", "p10"].some(
      (pos) => raceResults[pos] === player[pos]
    );

    return {
      udimpo: correctPodium, // ✅ Acierta los 3 del podio en desorden
      bullseye: correctBullseye, // ✅ Acierta BOR + MFM (al menos uno en cada categoría)
      podium: correctPodiumOrder, // ✅ Acierta los 3 del podio en orden exacto
      hatTrick: correctHatTrick, // ✅ Acierta Pole + P1 + Fastest Lap
      omen: correctPicks === Object.keys(raceResults).length, // ✅ Acierta TODO en la carrera
    };
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    // Simulación de autenticación básica
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

  // Ventana Login
  if (!isLoggedIn) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ p: 4, mt: 10 }}>
          <Typography variant="h5" align="center" gutterBottom>
            🔒 Iniciar Sesión
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              name="username"
              label="Usuario"
              variant="outlined"
              required
            />
            <TextField
              name="password"
              type="password"
              label="Contraseña"
              variant="outlined"
              required
            />
            <Button type="submit" variant="contained" color="primary">
              Entrar
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  const handleSavePredictions = () => {
    fetch(`${API_URL}/save_predictions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: currentUser,
        race: selectedRace,
        season: selectedSeason, // 📌 Enviamos la temporada correcta
        predictions: editedPredictions[currentUser],
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("✅ Predicción guardada!");

        // 📌 Recargar predicciones después de guardar
        fetch(`${API_URL}/get_predictions/${selectedSeason}`)
          .then((res) => res.json())
          .then((data) => {
            console.log("🔍 Predicciones obtenidas:", data);
            const racePredictions = data.predictions.filter(
              (p) => p.race === selectedRace
            );
            setPredictions(racePredictions);
          })
          .catch((error) =>
            console.error("🚨 Error obteniendo predicciones:", error)
          );

        setIsEditing(false); // Salir del modo edición
      })
      .catch(() => alert("❌ Error guardando predicciones"));
  };

  const rankingData = [
    { id: "tatan", points: 150 }, // First place
    { id: "tato", points: 120 }, // Second place
    { id: "kike", points: 100 }, // Third place
  ];
  console.log("data enviada: ", leaderboard)

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen text-center">
      <Paper
        elevation={4}
        width={1}
        sx={{
          p: 4,
          textAlign: "center",
          backgroundColor: "red",
        }}
      >
        <img src={f1Logo} alt={"No image"} width={100} />
        <Typography
          variant="h5"
          gutterBottom
          color="white"
          fontFamily={"fantasy"}
          marginBottom={-2}
        >
          Prediction Party F1 2025
        </Typography>
      </Paper>

      {/* Leaderboard - Podio */}
      <Box padding={2}>
        <Podium ranking={leaderboard} />
      </Box>

      <Box padding={2} gap={2} display={"flex"} justifyContent={"center"}>
        {/* Selector de Carrera */}
        <FormControl sx={{ display: "flex" }} size="small">
          <InputLabel>Race</InputLabel>
          <Select
            value={selectedRace}
            onChange={(e) => setSelectedRace(e.target.value)}
            label="Race"
          >
            {races.map((race) => (
              <MenuItem key={race.round} value={race.round}>
                {race.round} - {race.raceName} 
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Selector de Temporada */}
        <FormControl sx={{ display: "flex" }} size="small">
          <InputLabel>Season</InputLabel>
          <Select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            label="Season"
          >
            {availableSeasons.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* 🏁 Info de la carrera */}
      <RaceDetails raceInfo={raceInfo} selectedRace={selectedRace}/>

      {loading && (
        <p className="text-center text-gray-400">Cargando datos...</p>
      )}

      {/* Botón de edición */}
      <Button
        onClick={() => setIsEditing(!isEditing)}
        className={`p-2 rounded text-white mt-4 ${
          isEditing ? "bg-red-500" : "bg-blue-500"
        }`}
      >
        {isEditing ? "Cancelar Edición" : "Editar Predicción"}
      </Button>

      {/* 📌 Tabla de predicciones */}
      <div className="bg-gray-800 p-4 rounded shadow-md text-center mb-6">
        <TableContainer
          component={Paper}
          sx={{ bgcolor: "#1f2937", mt: 4, paddingBottom: "86px" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Categoría
                </TableCell>
                {players.map((player) => (
                  <TableCell
                    key={player}
                    sx={{ color: "white", fontWeight: "bold" }}
                  >
                    {player}
                  </TableCell>
                ))}
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Resultados
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(categories).map((key) => (
                <React.Fragment key={key}>
                  {/* Separador antes de los bonos */}
                  {key === "bullseye" && (
                    <TableRow>
                      <TableCell
                        colSpan={players.length + 2}
                        sx={{ borderBottom: "3px solid #9ca3af" }}
                      />
                    </TableRow>
                  )}

                  <TableRow>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      {categories[key]}
                    </TableCell>
                    {players.map((player) => {
                      const prediction = predictions.find(
                        (p) => p.user === player
                      );
                      const isBonusCategory = [
                        "udimpo",
                        "podium",
                        "hatTrick",
                        "bullseye",
                        "omen",
                      ].includes(key);
                      const bonusCheck = checkBonuses(prediction)[key]
                        ? "✔️"
                        : "❌";
                      const value = prediction ? prediction[key] || "-" : "-";

                      const cellColor = isBonusCategory
                        ? checkBonuses(prediction)[key]
                          ? "#22c55e" // verde
                          : "#374151" // gris
                        : raceResults[key] &&
                          prediction?.[key] === raceResults[key]
                        ? "#22c55e"
                        : prediction?.[key]
                        ? "#ef4444"
                        : "#374151";

                      return (
                        <TableCell
                          key={player}
                          sx={{
                            bgcolor: cellColor,
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          {isBonusCategory ? (
                            bonusCheck
                          ) : currentUser === player && isEditing ? (
                            <select
                              value={
                                editedPredictions[player]?.[key] ||
                                prediction?.[key] ||
                                ""
                              }
                              onChange={(e) => {
                                setEditedPredictions((prev) => ({
                                  ...prev,
                                  [player]: {
                                    ...prev[player],
                                    [key]: e.target.value,
                                  },
                                }));
                              }}
                              style={{
                                backgroundColor: "#374151",
                                color: "white",
                                padding: "0.3rem",
                                borderRadius: "4px",
                              }}
                            >
                              <option value="">Seleccionar piloto</option>
                              {drivers.map((driver) => (
                                <option key={driver.code} value={driver.code}>
                                  {driver.code}
                                </option>
                              ))}
                            </select>
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}

                    {/* Resultado */}

                    <TableCell
                      sx={{
                        bgcolor: "#4b5563",
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      {key === "bullseye"
                        ? "Total Aciertos:"
                        : key === "hatTrick"
                        ? totalHits
                        : key === "podium"
                        ? "Ganador Ronda:"
                        : raceResults[key] || "-"}
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}

              {/* Puntaje final */}
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  PUNTAJE
                </TableCell>
                {players.map((player) => {
                  const prediction = predictions.find((p) => p.user === player);
                  return (
                    <TableCell
                      key={player}
                      sx={{
                        bgcolor: "#4b5563",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {calculatePoints(prediction)}
                    </TableCell>
                  );
                })}

                <TableCell
                  colSpan={players.length + 1}
                  sx={{
                    bgcolor: "#FFD700",
                    color: "black",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  🏆 {winner || "Aún no definido"}
                </TableCell>

                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {isEditing && (
          <Box mt={2}>
            <Button
              onClick={handleSavePredictions}
              variant="contained"
              color="success"
            >
              Guardar Predicciones
            </Button>
          </Box>
        )}
      </div>
      <BottomNavBar />
    </div>
  );
}
