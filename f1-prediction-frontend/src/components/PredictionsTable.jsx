// ✅ PredictionsTable.jsx completo y limpio
import React from "react";
import BonusHUD from "./BonusHUD";
import NextRaceCard from "./NextRaceCard";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box, Alert, Button
} from "@mui/material";

export default function PredictionsTable({
  categories, players, predictions, raceResults,
  drivers, currentUser, isEditing, setEditedPredictions,
  editedPredictions, handleSavePredictions, hasOfficialResults, nextRace
}) {
  const bonusKeys = ["udimpo", "podium", "hatTrick", "bullseye", "omen"];
  const visibleCategories = Object.keys(categories).filter(key => !bonusKeys.includes(key));

  return (
    <Box>

      {/* ✅ TARJETA PRÓXIMA CARRERA */}
      {nextRace && (
        <Box mb={2}><NextRaceCard race={nextRace} /></Box>
      )}

      <Box sx={{ position: "sticky", top: 0, zIndex: 20, bgcolor: "#121212" }}>
        {!hasOfficialResults && (
          <Alert severity="info" 
            sx={{ 
              mb: 2, 
              borderRadius: 2, 
              position: "sticky", 
              left: 0, 
              zIndex: 20, 
              bgcolor: "#1976d2", 
              color: "white" 
            }}>
            Aún no hay resultados oficiales para esta carrera.
          </Alert>
        )}
      </Box>

      <TableContainer
        component={Paper}
        sx={{ mt: 2, width: "100%", overflowX: "auto", bgcolor: "#121212", borderRadius: 3, boxShadow: "0 0 20px rgba(0,0,0,0.5)" }}
      >

        <Table size="small" sx={{ tableLayout: "fixed", minWidth: "600px", fontFamily: "'Barlow Condensed', sans-serif", borderCollapse: "separate", borderSpacing: "0px 2px" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ position: "sticky", left: 0, zIndex: 10, bgcolor: "#121212", fontWeight: "bold", width: "40px", maxWidth: "40px", color: "white", borderRight: "1px solid #333", textAlign: "center" }}>🏁</TableCell>
              {players.map(player => (
                <TableCell key={player} sx={{ color: "#ddd", fontWeight: "bold", textAlign: "center", width: "45px", maxWidth: "45px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{player}</TableCell>
              ))}
              <TableCell sx={{ position: "sticky", right: 0, zIndex: 10, bgcolor: "#121212", fontWeight: "bold", width: "40px", maxWidth: "40px", color: "white", borderLeft: "1px solid #333", textAlign: "center" }}>✔️</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleCategories.map(key => (
              <TableRow key={key}>
                <TableCell sx={{ position: "sticky", left: 0, bgcolor: "#121212", color: "white", fontWeight: "bold", width: "40px", maxWidth: "40px", borderRight: "1px solid #333", textAlign: "center" }}>{categories[key]}</TableCell>
                {players.map(player => {
                  const prediction = predictions.find(p => p.user.toLowerCase() === player.toLowerCase());
                  const value = prediction?.[key] || "";
                  const isArrayResult = Array.isArray(raceResults[key]);
                  const isHit = raceResults[key] && (isArrayResult ? raceResults[key]?.includes(value) : raceResults[key] === value);
                  const cellColor = !raceResults[key] ? "#374151" : isHit ? "#15803d" : value ? "#b91c1c" : "#374151";
                  return (
                    <TableCell key={player} sx={{ bgcolor: cellColor, color: "white", fontWeight: "bold", width: "45px", maxWidth: "45px", textAlign: "center" }}>
                      {currentUser === player && isEditing ? (
                        <select
                          value={editedPredictions[player]?.[key] ?? value}
                          onChange={e => setEditedPredictions(prev => ({ ...prev, [player]: { ...prev[player], [key]: e.target.value } }))}
                          style={{ backgroundColor: "#374151", color: "white", padding: "0.2rem", borderRadius: "4px", width: "100%" }}
                        >
                          <option value="">-</option>
                          {drivers.map(driver => (
                            <option key={driver.code} value={driver.code}>{driver.code}</option>
                          ))}
                        </select>
                      ) : value}
                    </TableCell>
                  );
                })}
                <TableCell sx={{ position: "sticky", right: 0, bgcolor: "#222", color: "white", fontWeight: "bold", width: "40px", maxWidth: "40px", borderLeft: "1px solid #333", textAlign: "center" }}>{Array.isArray(raceResults[key]) ? raceResults[key]?.join(", ") : raceResults[key] || "-"}</TableCell>
              </TableRow>
            ))}

            {/* ---------- FILA PUNTAJE ---------- */}
            <TableRow>
              <TableCell sx={{ position: "sticky", left: 0, bgcolor: "#111", color: "white", fontWeight: "bold", width: "40px", maxWidth: "40px" }}>Puntaje</TableCell>
              {players.map(player => {
                const prediction = predictions.find(p => p.user.toLowerCase() === player.toLowerCase());
                return (
                  <TableCell key={player} sx={{ bgcolor: "#111", color: "white", fontWeight: "bold", textAlign: "center", width: "45px", maxWidth: "45px" }}>
                    {prediction?.points ?? "-"} <BonusHUD prediction={prediction} />
                  </TableCell>
                );
              })}
              <TableCell sx={{ position: "sticky", right: 0, bgcolor: "#111", width: "40px", maxWidth: "40px" }} />
            </TableRow>

          </TableBody>
        </Table>



      </TableContainer>
    </Box>
  );
}
