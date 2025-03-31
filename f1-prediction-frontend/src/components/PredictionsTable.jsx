import React from "react";
import BonusHUD from "./BonusHUD";
import NextRaceCard from "./NextRaceCard";
import RaceAlert from "./RaceAlert";
import { Avatar, Tooltip } from "@mui/material";
import { PLAYERS } from "../data/players";


import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box,
} from "@mui/material";

export default function PredictionsTable({
  categories, players, predictions, raceResults,
  drivers, currentUser, isEditing, setEditedPredictions,
  editedPredictions, handleSavePredictions, hasOfficialResults, nextRace, isAdmin,
}) {
  const bonusKeys = ["udimpo", "podium", "hatTrick", "bullseye", "omen"];
  const visibleCategories = Object.keys(categories).filter(key => !bonusKeys.includes(key));

  const safeResults = raceResults || {};

  return (
    <Box>
      
      {/* ✅ TARJETA PRÓXIMA CARRERA */}
      {nextRace && (
        <Box mb={2}><NextRaceCard race={nextRace} /></Box>
      )}

      <Box sx={{ position: "sticky", top: 0, zIndex: 20, bgcolor: "#121212" }}>
        {nextRace && <RaceAlert race={nextRace} />}
      </Box>

      {/* ✅ TABLA DE PREDICCIONES */}
      <TableContainer
      component={Paper}
      sx={{
        mt: 2,
        width: "100%",
        overflowX: "auto",
        bgcolor: "#121212",
        borderRadius: 3,
        boxShadow: "0 0 20px rgba(0,0,0,0.5)"
      }}
    >
      <Table
        size="small"
        sx={{
          tableLayout: "fixed",
          minWidth: `${players.length * 30 + 120}px`, // <<< dinámica
          fontFamily: "'Barlow Condensed', sans-serif",
          borderCollapse: "separate",
          borderSpacing: "0px 2px"
        }}
      >
        <TableHead>
          <TableRow>
            {/* Columna Categoría */}
            <TableCell sx={{
              position: "sticky",
              left: 0,
              bgcolor: "#121212",
              color: "white",
              fontWeight: "bold",
              width: "15px",
              maxWidth: "15px",
              minWidth: "15px",
              px: 0.2,
              borderRight: "1px solid #333",
              textAlign: "center"
            }}>🏁</TableCell>

            {/* Columnas de Players */}
            {players.map((player, i) => (
              <TableCell 
                key={player}
                sx={{
                  color: "#ddd",
                  fontWeight: "bold",
                  textAlign: "center",
                  width: "20px",
                  maxWidth: "20px",
                  minWidth: "20px",
                  px: 0.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  position: "relative", // Necesario para ::after
                  // Separador solo si no es el último player
                  ...(i < players.length - 1 && {
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: "15%",
                      bottom: "15%",
                      right: 0,
                      width: "1px",
                      backgroundColor: "rgba(255,255,255,0.1)",
                    }
                  })
                }}
              >
                <Tooltip title={player}>
                  <Avatar
                    src={PLAYERS[player]?.image}
                    alt={player}
                    sx={{
                      width: 24,
                      height: 24,
                      mx: "auto",
                      border: "1px solid #444",
                    }}
                  />
                </Tooltip>
              </TableCell>
            ))}

            {/* Columna Resultados */}
            <TableCell sx={{
              position: "sticky",
              right: 0,
              bgcolor: "#121212",
              color: "white",
              fontWeight: "bold",
              width: "20px",
              maxWidth: "20px",
              minWidth: "20px",
              px: 0.2,
              borderLeft: "1px solid #333",
              textAlign: "center"
            }}>✔️</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {visibleCategories.map(key => (
            <TableRow key={key}>
              {/* Categoría */}
              <TableCell sx={{
                position: "sticky",
                left: 0,
                bgcolor: "#121212",
                color: "white",
                fontWeight: "bold",
                width: "28px",
                maxWidth: "28px",
                minWidth: "28px",
                px: 0.2,
                borderRight: "1px solid #333",
                textAlign: "center"
              }}>
                {categories[key]}
              </TableCell>

              {/* Predicciones */}
              {players.map((player, i) => {
                const prediction = predictions.find(p => p.user.toLowerCase() === player.toLowerCase());
                const value = prediction?.[key] || "";
                const isArrayResult = Array.isArray(safeResults[key]);
                const isHit = safeResults[key] && (isArrayResult ? safeResults[key]?.includes(value) : safeResults[key] === value);
                const cellColor = !safeResults[key] ? "#374151" : isHit ? "#15803d" : value ? "#b91c1c" : "#374151";
                return (
                  <TableCell key={player} sx={{
                    bgcolor: cellColor,
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                    width: "32px",
                    maxWidth: "32px",
                    minWidth: "28px",
                    px: 0.2,
                    position: "relative", 
                    ...(i < players.length - 1 && { 
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        top: "15%",
                        bottom: "15%",
                        right: 0,
                        width: "1px",
                        backgroundColor: "rgba(255,255,255,0.1)"
                      }
                    })
                  }}>
                      {(isAdmin || currentUser?.name === player) && isEditing ? (
                      <select
                        value={editedPredictions[player]?.[key] ?? value}
                        onChange={e => setEditedPredictions(prev => ({ ...prev, [player]: { ...prev[player], [key]: e.target.value } }))}
                        style={{
                          backgroundColor: "#374151",
                          color: "white",
                          padding: "0.1rem",
                          borderRadius: "4px",
                          width: "100%",
                          fontSize: "0.75rem"
                        }}
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

              {/* Resultado */}
              <TableCell sx={{
                position: "sticky",
                right: 0,
                bgcolor: "#222",
                color: "white",
                fontWeight: "bold",
                width: "28px",
                maxWidth: "28px",
                minWidth: "28px",
                px: 0.2,
                borderLeft: "1px solid #333",
                textAlign: "center"
              }}>
                {Array.isArray(safeResults[key]) ? safeResults[key]?.join(", ") : safeResults[key] || "-"}
              </TableCell>
            </TableRow>
          ))}

          {/* Fila Puntaje */}
          <TableRow>
            <TableCell sx={{
              position: "sticky",
              left: 0,
              bgcolor: "#111",
              color: "white",
              fontWeight: "bold",
              width: "28px",
              maxWidth: "28px",
              minWidth: "28px"
            }}>
              Puntaje
            </TableCell>

            {players.map(player => {
              const prediction = predictions.find(p => p.user.toLowerCase() === player.toLowerCase());
              return (
                <TableCell key={player} sx={{
                  bgcolor: "#111",
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  width: "32px",
                  maxWidth: "32px",
                  minWidth: "28px",
                  px: 0.2
                }}>
                  {prediction?.points ?? "-"} <BonusHUD prediction={prediction} />
                </TableCell>
              );
            })}

            <TableCell sx={{
              position: "sticky",
              right: 0,
              bgcolor: "#111",
              width: "28px",
              maxWidth: "28px",
              minWidth: "28px"
            }} />
          </TableRow>
        </TableBody>
      </Table>
      </TableContainer>
    </Box>
  );
}
