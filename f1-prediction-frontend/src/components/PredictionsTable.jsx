import React from "react";
import BonusHUD from "./BonusHUD";
import NextRaceCard from "./NextRaceCard";
import { Avatar, Tooltip } from "@mui/material";
import { PLAYERS } from "../data/players";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box,
} from "@mui/material";

export default function PredictionsTable({
  categories, players, predictions, raceResults,
  drivers, currentUser, isEditing, setEditedPredictions,
  editedPredictions, handleSavePredictions, hasOfficialResults, nextRace,
}) {
  const bonusKeys = ["udimpo", "podium", "hatTrick", "bullseye", "omen"];
  const visibleCategories = Object.keys(categories).filter(key => !bonusKeys.includes(key));
  const safeResults = raceResults || {};

  return (
    <Box>
      {nextRace && (
        <Box mb={2}><NextRaceCard race={nextRace} /></Box>
      )}

      <Box sx={{ position: "sticky", top: 0, zIndex: 20, bgcolor: "background.default" }} />

      <TableContainer component={Paper} sx={{
        mt: 2,
        width: "100%",
        overflowX: "auto",
        bgcolor: "background.paper",
        borderRadius: 3,
        boxShadow: "0 0 12px rgba(0,0,0,0.3)"
      }}>
        <Table size="small" sx={{
          tableLayout: "fixed",
          minWidth: `${players.length * 30 + 120}px`,
          borderCollapse: "separate",
          borderSpacing: "0px 2px"
        }}>

          <TableHead>
            <TableRow>
              <TableCell sx={{ position: "sticky", left: 0, bgcolor: "background.default", color: "text.primary", fontWeight: "bold", textAlign: "center", borderRight: "1px solid rgba(255,70,85,0.4)" }}>🏁</TableCell>
              {players.map((player, i) => (
                <TableCell key={player} sx={{ color: "text.secondary", fontWeight: "bold", textAlign: "center", borderRight: i < players.length - 1 ? "1px solid rgba(255,70,85,0.4)" : undefined }}>
                  <Tooltip title={player}>
                    <Avatar src={PLAYERS[player]?.image} alt={player} sx={{ width: 24, height: 24, mx: "auto", border: "1px solid rgba(255,70,85,0.4)" }} />
                  </Tooltip>
                </TableCell>
              ))}
              <TableCell sx={{ position: "sticky", right: 0, bgcolor: "background.default", color: "text.primary", fontWeight: "bold", textAlign: "center", borderLeft: "1px solid rgba(255,70,85,0.4)" }}>✔️</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleCategories.map(key => (
              <TableRow key={key}>
                <TableCell sx={{ position: "sticky", left: 0, bgcolor: "background.paper", color: "text.primary", fontWeight: "bold", textAlign: "center", borderRight: "1px solid rgba(255,70,85,0.4)" }}>{categories[key]}</TableCell>
                {players.map(player => {
                  const prediction = predictions.find(p => p.user.toLowerCase() === player.toLowerCase());
                  const value = prediction?.[key] || "";
                  const isArrayResult = Array.isArray(safeResults[key]);
                  const isHit = safeResults[key] && (isArrayResult ? safeResults[key]?.includes(value) : safeResults[key] === value);
                  const cellColor = !safeResults[key] ? "background.default" : isHit ? "primary.main" : value ? "#2c2c2c" : "background.default";
                  return (
                    <TableCell key={player} sx={{ bgcolor: cellColor, color: "text.primary", fontWeight: "bold", textAlign: "center", borderRight: "1px solid rgba(255,70,85,0.4)" }}>
                      {isEditing && (currentUser?.isAdmin || currentUser?.name === player) ? (
                     <select
                     value={editedPredictions[player]?.[key] ?? value}
                     onChange={e => setEditedPredictions(prev => ({ ...prev, [player]: { ...prev[player], [key]: e.target.value } }))}
                     style={{
                       backgroundColor: "rgba(255,255,255,0.05)",
                       color: value ? "#ff4655" : "white", // 👈 rojo si tiene valor, blanco si no
                       borderRadius: "4px",
                       width: "100%",
                       fontSize: "0.75rem",
                       padding: "0px",
                       height: "22px",
                       lineHeight: "10px",
                       border: "1px solid rgba(255,70,85,0.4)",
                       outline: "none",
                       appearance: "none",
                       textAlignLast: "center",
                       transition: "all 0.2s ease",
                       cursor: "pointer"
                     }}
                     onFocus={(e) => e.target.style.backgroundColor = "rgba(255,70,85,0.1)"}
                     onBlur={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.05)"}
                   >
                     <option value="" style={{ color: "white" }}>-</option>
                     {drivers.map(driver => (
                       <option key={driver.code} value={driver.code} style={{ color: "#ff4655" }}>
                         {driver.code}
                       </option>
                     ))}
                   </select>
                   
                   
                    
                     
                      

                      ) : value}
                    </TableCell>
                  );
                })}
                <TableCell sx={{ position: "sticky", right: 0, bgcolor: "background.paper", color: "text.primary", fontWeight: "bold", textAlign: "center", borderLeft: "1px solid rgba(255,70,85,0.4)" }}>
                  {Array.isArray(safeResults[key]) ? safeResults[key]?.join(", ") : safeResults[key] || "-"}
                </TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell sx={{ position: "sticky", left: 0, bgcolor: "background.default", color: "text.primary", fontWeight: "bold", borderRight: "1px solid rgba(255,70,85,0.4)" }}>Puntaje</TableCell>
              {players.map(player => {
                const prediction = predictions.find(p => p.user.toLowerCase() === player.toLowerCase());
                return (
                  <TableCell key={player} sx={{ bgcolor: "background.paper", color: "text.primary", fontWeight: "bold", textAlign: "center", borderRight: "1px solid rgba(255,70,85,0.4)" }}>
                    {prediction?.points ?? "-"} <BonusHUD prediction={prediction} />
                  </TableCell>
                );
              })}
              <TableCell sx={{ position: "sticky", right: 0, bgcolor: "background.default", borderLeft: "1px solid rgba(255, 70, 86, 0.69)" }} />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      
    </Box>
  );
}
