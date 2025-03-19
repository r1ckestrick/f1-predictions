import "./App.css";  // Asegura que los estilos se carguen correctamente
import { useState, useEffect } from "react"
import API_URL from "./config.js"

export default function App() {
  const [selectedRace, setSelectedRace] = useState("");
  const [races, setRaces] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [raceResults, setRaceResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [totalHits, setTotalHits] = useState(0);
  const [winner, setWinner] = useState("");
  const [currentUser, setCurrentUser] = useState("");  // Usuario logueado
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Indica si está autenticado
  const [isEditing, setIsEditing] = useState(false); // Modo edición activado/desactivado
  const [editedPredictions, setEditedPredictions] = useState({}); // Almacena las ediciones
  const [raceInfo, setRaceInfo] = useState(null);
  const [leaderboard, setLeaderboard] = useState([])
  const [season, setSeason] = useState("2025"); // Default
  const [availableSeasons, setAvailableSeasons] = useState([]);
  


  const categories = {
    pole: "POLE",
    p1: "P1",
    p2: "P2",
    p3: "P3",
    fastest_lap: "FL",
    most_overtakes: "MO",
    dnf: "DNF",
    driver_of_day: "DOTD",
    udimpo: "UDIMPO",
    podium: "PODIUM",
    casimen: "CASIMEN",
    omen: "OMEN"
  };

  const calculatePoints = (player) => {
    if (!player || !raceResults) return 0;
  
    let points = 0;
    const bonuses = checkBonuses(player);
  
    // Sumar 10 puntos por cada acierto
    Object.keys(raceResults).forEach((key) => {
      if (raceResults[key] === player[key]) {
        points += 10;
      }
    });
  
    // Aplicar los bonos activos
    if (bonuses.udimpo) points *= 2;
    if (bonuses.podium) points *= 2;
    if (bonuses.casimen) points *= 2;
    if (bonuses.omen) points *= 2;
  
    return points;
  };

  const players = ["Renato", "Sebastian", "Enrique"];

  const [drivers, setDrivers] = useState([]);

  const fetchDrivers = () => {
    fetch(`${API_URL}/get_drivers/2024`) // Ajusta la URL según corresponda
      .then((res) => res.json())
      .then((data) => {
        if (data.drivers) {
          setDrivers(data.drivers);
        }
      })
      .catch((error) => console.error("Error obteniendo la lista de pilotos:", error));
  };
  
  useEffect(() => {
    fetch(`(${API_URL})/leaderboard`)
      .then((res) => res.json())
      .then((data) => {
        setLeaderboard(data);
      })
      .catch((error) => console.error("Error obteniendo leaderboard:", error));
  }, []);
  
  useEffect(() => {
    fetch(`${API_URL}/get_latest_season`)
      .then((res) => res.json())
      .then((data) => {
        if (data.latest_season) {
          const latest = parseInt(data.latest_season);
          setSeason(latest);
          setAvailableSeasons(Array.from({ length: latest - 1949 }, (_, i) => latest - i)); // Genera años desde 1950 hasta la última
        }
      })
      .catch((err) => console.error("Error obteniendo las temporadas:", err));
  }, []);
  
  useEffect(() => {
    fetch(`${API_URL}/get_all_races/2024`)
      .then((res) => res.json())
      .then((data) => {
        if (data.races && data.races.length > 0) {
          setRaces(data.races);
          setSelectedRace(data.races[0].round);
        }
      })
      .catch((error) => console.error("Error al obtener lista de carreras:", error))
      .finally(() => setLoading(false));
  }, []);


  useEffect(() => {
    if (!selectedRace) return;

    fetch(`${API_URL}/get_race_info/2024/${selectedRace}`)
    .then((res) => res.json())
    .then((data) => {
      if (data && data.raceName) {
        console.log("🏎️ Info de la carrera recibida:", data); // 🔍 Verificar la respuesta
        setRaceInfo({
          name: data.raceName,
          circuit: data.circuitName,
          date: data.date,
          imageUrl: data.mapImage || "",
          status: data.status || "En Curso"
       });

       // 🛠️ Imprimir en consola lo que recibe raceInfo
       console.log("Información de la carrera:", data);
     }
   })
   .catch((error) => {
    console.error("🚨 Error obteniendo info de la carrera:", error);
    setRaceInfo(null);
   });
  
    
 fetch(`${API_URL}/get_predictions`)
   .then((res) => res.json())
   .then((data) => {
     const racePredictions = data.predictions.filter(p => p.race === selectedRace);
     setPredictions(racePredictions);
   })
   .catch(() => setPredictions([]));

 fetch(`${API_URL}/get_race_results/2024/${selectedRace}`)
   .then((res) => res.ok ? res.json() : {})
   .then((data) => {
     if (data.MRData && data.MRData.RaceTable.Races.length > 0) {
       const raceData = data.MRData.RaceTable.Races[0];

       setRaceInfo({
        name: raceData.raceName,
        round: raceData.round,
        date: raceData.date,
        circuit: raceData.Circuit.circuitName,
        location: `${raceData.Circuit.Location.locality}, ${raceData.Circuit.Location.country}`,
        map: raceData.Circuit.url.replace("https://www.", "https://maps.google.com/?q="), // Convierte el link de F1 en un mapa de Google
        
      });

       const processedResults = {
         pole: raceData.Results?.[0]?.Driver?.code || "-",
         p1: raceData.Results?.[0]?.Driver?.code || "-",
         p2: raceData.Results?.[1]?.Driver?.code || "-",
         p3: raceData.Results?.[2]?.Driver?.code || "-",
         fastest_lap: raceData.Results?.find((r) => r.FastestLap)?.Driver?.code || "-",
         most_overtakes: "-",
         dnf: raceData.Results?.find((r) => r.status !== "Finished")?.Driver?.code || "-",
         driver_of_day: "-"
       };

       setRaceResults(processedResults);
     } else {
       setRaceResults({});
     }
   })
   .catch(() => setRaceResults({}))
   .finally(() => setLoading(false));
}, [selectedRace]);
  
  useEffect(() => {
    fetch(`${API_URL}/get_all_races/2024`)
      .then((res) => res.json())
      .then((data) => {
        if (data.races && data.races.length > 0) {
          setRaces(data.races);
          setSelectedRace(data.races[0].round);
        }
      })
      .catch((error) => console.error("Error al obtener lista de carreras:", error))
      .finally(() => setLoading(false));
  
    fetchDrivers(); // 📌 Llamamos a la función que obtiene los pilotos  
  }, []);

  useEffect(() => {
    let maxHits = 0;
    let roundWinner = "";
    let total = 0;

    predictions.forEach(player => {
      let count = Object.keys(raceResults).filter(key => raceResults[key] === player[key]).length;
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
    if (!player || !raceResults) return { udimpo: false, podium: false, casimen: false, omen: false };
  
    const correctPicks = Object.keys(raceResults).filter((key) => raceResults[key] === player[key]).length;
    const correctPodium = ["p1", "p2", "p3"].every(pos => player[pos] && Object.values(raceResults).includes(player[pos]));
    const correctPodiumOrder = ["p1", "p2", "p3"].every(pos => raceResults[pos] === player[pos]);
  
    return {
      udimpo: correctPodium,     // Acertar al podio sin importar el orden
      podium: correctPodiumOrder, // Acertar al podio en el orden correcto
      casimen: correctPicks > 4,  // Acertar más de la mitad de las categorías (5 o más)
      omen: correctPicks === 8,   // Acertar todas las categorías
    };
  };
  
  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
  
    // Simulación de autenticación básica
    const users = {
      "Renato": "1234",
      "Sebastian": "5678",
      "Enrique": "91011"
    };
  
    if (users[username] && users[username] === password) {
      setCurrentUser(username);
      setIsLoggedIn(true);
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };
  // 📌 Función para formatear la fecha de "YYYY-MM-DD" a un formato más amigable
const formatDate = (dateStr) => {
  if (!dateStr) return "Fecha no disponible";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateStr).toLocaleDateString("es-ES", options);
};

  if (!isLoggedIn) {
    return (
      
      <div className="p-6 bg-gray-900 text-white min-h-screen text-center">
        <div className="bg-gray-800 p-4 rounded shadow-md text-center mb-6">
          <h2 className="text-xl font-bold mb-2">🔒 Iniciar Sesión</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              name="username"
              placeholder="Usuario"
              required
              className="p-2 m-2 border rounded bg-gray-700 text-white"
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              required
              className="p-2 m-2 border rounded bg-gray-700 text-white"
            />
            <button type="submit" className="p-2 bg-blue-500 rounded text-white">
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleSavePredictions = () => {
    fetch(`${API_URL}/save_predictions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: currentUser,
        race: selectedRace, // ✅ Ahora sí enviamos race_id
        predictions: editedPredictions[currentUser],
      }),
    })  
    .then((res) => res.json())
    .then(() => {
        alert("✅ Predicción guardada!");

        // Recargar predicciones después de guardar
        fetch(`${API_URL}/get_predictions`)
        .then((res) => res.json())
        .then((data) => {
          const racePredictions = data.predictions.filter(p => p.race === selectedRace);
          setPredictions(racePredictions);
        })
        .catch(() => setPredictions([]));
      

        setIsEditing(false); // Salir del modo edición
    })
    .catch(() => alert("❌ Error guardando predicciones"));
};
console.log("🏆 Leaderboard recibido:", leaderboard);
  
return (
  <div className="p-6 bg-gray-900 text-white min-h-screen text-center">
    <div className="bg-gray-800 p-4 rounded shadow-md text-center mb-6">
      <h2 className="text-xl font-bold mb-2">🏎️ Race Week 🏎️</h2>
      <select
        value={selectedRace}
        onChange={(e) => setSelectedRace(e.target.value)}
        className="p-2 border rounded bg-gray-700 text-white"
      >
        {races.map((race) => (
          <option key={race.round} value={race.round}>
            {race.raceName} - {race.round}
          </option>
        ))}
      </select>
    </div>

{/* Leaderboard - Podio */}
<div className="bg-gray-800 p-4 rounded shadow-md text-center mb-6">
  <h2 className="text-xl font-bold mb-2">🏆 Prediction Party F1 2024 🏆</h2>

  {leaderboard.length >= 3 ? (
    <div className="flex justify-center items-end space-x-6">

      {/* Selector de temporada */}
      <label htmlFor="season">Selecciona una temporada:</label>
      <select id="season" value={season} onChange={(e) => setSeason(e.target.value)}>
        {availableSeasons.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>

      {/* 🥈 Segundo Lugar */}
      <div className="flex flex-col items-center w-1/4">
        <img src="/images/tato.png" alt="TATO" className="h-32 rounded-full border-4 border-gray-400" />
        <div className="bg-gray-700 text-white p-3 rounded mt-2 w-full text-center">
          <h3 className="font-bold text-lg">{leaderboard[1].name}</h3>
          <p className="text-md">{leaderboard[1].total_points ?? 0} Puntos</p>
          <p className="text-2xl font-bold">🥈</p>
        </div>
      </div>

      {/* 🥇 Primer Lugar (Centro) */}
      <div className="flex flex-col items-center w-1/3">
        <img src="/images/tatan.png" alt="TATAN" className="h-40 rounded-full border-4 border-yellow-500" />
        <div className="bg-yellow-500 text-black p-3 rounded mt-2 w-full text-center">
          <h3 className="font-bold text-lg">{leaderboard[0].name}</h3>
          <p className="text-md">{leaderboard[0].total_points ?? 0} Puntos</p>
          <p className="text-3xl font-bold">🥇</p>
        </div>
      </div>

      {/* 🥉 Tercer Lugar */}
      <div className="flex flex-col items-center w-1/4">
        <img src="/images/kike.png" alt="KIKE" className="h-32 rounded-full border-4 border-gray-400" />
        <div className="bg-gray-700 text-white p-3 rounded mt-2 w-full text-center">
          <h3 className="font-bold text-lg">{leaderboard[2].name}</h3>
          <p className="text-md">{leaderboard[2].total_points ?? 0} Puntos</p>
          <p className="text-2xl font-bold">🥉</p>
        </div>
      </div>

    </div>
  ) : (
    <p className="text-gray-400">Cargando ranking...</p>
  )}
</div>


    {/* 🏁 Info de la carrera */}
    {raceInfo && (
      <div className="bg-gray-800 p-4 rounded shadow-md text-center mb-6">
        <h2 className="text-xl font-bold mb-2">{raceInfo.name}</h2>
        <p className="text-gray-300">
          Ronda {selectedRace} - {formatDate(raceInfo.date)}
        </p>
        <p className="text-gray-300">{raceInfo.circuit} - {raceInfo.location}</p>

        {raceInfo.imageUrl ? (
          <img 
            src={raceInfo.imageUrl} 
            alt={`Circuito de ${raceInfo.name}`} 
            className="w-full h-auto rounded-lg shadow-lg mt-4"
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = "https://via.placeholder.com/800x400?text=Mapa+No+Disponible"; 
            }} 
          />
        ) : (
          <p className="text-gray-500">Imagen no disponible</p>
        )}
      </div>
    )}

    {loading && <p className="text-center text-gray-400">Cargando datos...</p>}

    {/* Botón de edición */}
    <button
      onClick={() => setIsEditing(!isEditing)}
      className={`p-2 rounded text-white mt-4 ${isEditing ? "bg-red-500" : "bg-blue-500"}`}
    >
      {isEditing ? "Cancelar Edición" : "Editar Predicción"}
    </button>

    {/* 📌 Tabla de predicciones */}
    <div className="bg-gray-800 p-4 rounded shadow-md text-center mb-6">
      <table className="w-full border-collapse border border-gray-600">
        <thead>
          <tr className="bg-gray-700">
            <th className="border border-gray-600 p-2">Categoría</th>
            {players.map((player) => (
              <th key={player} className="border border-gray-600 p-2">{player}</th>
            ))}
            <th className="border border-gray-600 p-2">Resultados Reales</th>
          </tr>
        </thead>
          
          <tbody>
  {Object.keys(categories).map((key, index) => (
    <>
      {/* 📌 Separador antes de los bonos */}
      {key === "udimpo" && (
        <tr className="bg-gray-900">
          <td colSpan={players.length + 2} className="border-t-4 border-gray-500 p-2 font-bold text-white">
            
          </td>
        </tr>
      )}

      <tr key={key} className="bg-gray-800">
        <td className="border border-gray-600 p-2 font-bold">{categories[key]}</td>
        {players.map((player) => {
          const prediction = predictions.find(p => p.user === player);
          const isBonusCategory = ["udimpo", "podium", "casimen", "omen"].includes(key);
          const bonusCheck = checkBonuses(prediction)[key] ? "✔️" : "❌";

          return (
            
            <td key={player} 
              className={`border border-gray-600 p-2 
                ${isBonusCategory 
                  ? checkBonuses(prediction)[key] 
                    ? "bg-green-500 text-white"  // ✅ Bono activado
                    : "bg-gray-700 text-white"   // 🔹 Bono desactivado (gris)
                  : raceResults[key] && prediction?.[key] === raceResults[key] 
                    ? "bg-green-500 text-white font-bold" // ✅ Acierto → Verde
                    : prediction?.[key] 
                      ? "bg-red-500 text-white" // ❌ Fallo → Rojo
                      : "bg-gray-700 text-white" // 🔹 Sin predicción → Gris
                }`}
            >
              {isBonusCategory ? ( // 🔥 No permite edición, solo muestra el estado del bonus
                bonusCheck
              ) : currentUser === player ? ( // ✅ Solo permite edición en categorías normales
                isEditing ? (
                  <select
                    value={editedPredictions[player]?.[key] || prediction?.[key] || ""}
                    onChange={(e) => {
                      setEditedPredictions((prev) => ({
                        ...prev,
                        [player]: { ...prev[player], [key]: e.target.value },
                      }));
                    }}
                    className="bg-gray-700 text-white p-1 border rounded"
                  >
                    <option value="">Seleccionar piloto</option>
                    {drivers.map((driver) => (
                      <option key={driver.code} value={driver.code}>
                        {driver.code}
                      </option>
                    ))}
                  </select>
                ) : (
                  prediction ? prediction[key] || "-" : "-"
                )
              ) : (
                prediction ? prediction[key] || "-" : "-"
              )}
            </td>
          );
        })}
        
        {/* Ajuste para fusionar la celda de ganador en las filas OMEN y PUNTAJE */}
        {key === "omen" ? (
          <td className="border border-gray-600 p-2 font-bold bg-gray-700" rowSpan="2">
            {winner || "Nadie aún"}
          </td>
        ) : key === "puntaje" ? null : (
          <td className="border border-gray-600 p-2 font-bold bg-gray-700">
            {key === "udimpo" ? "Total Aciertos:" :
             key === "podium" ? totalHits :
             key === "casimen" ? "Ganador de la Ronda:" :
             raceResults[key] || "-"}
          </td>
        )}
      </tr>
    </>
  ))}

  {/* Fila única para el puntaje */}
  <tr className="bg-gray-800">
    <td className="border border-gray-600 p-2 font-bold">PUNTAJE</td>
    {players.map((player) => {
      const prediction = predictions.find(p => p.user === player);
      return (
        <td key={player} className="border border-gray-600 p-2 font-bold bg-gray-700">
          {calculatePoints(prediction)}
        </td>
      );
    })}
  </tr>
</tbody>
        </table>
        {isEditing && (
  <button
    onClick={handleSavePredictions}
    className="mt-4 p-2 bg-green-500 rounded text-white"
  >
    Guardar Predicciones
  </button>
)}
      </div>
    </div>
  );
}
