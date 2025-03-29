import React from "react";
import BonusHUD from "./BonusHUD";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box, Button
} from "@mui/material";

export default function PredictionsTable({
  categories,
  players,
  predictions,
  raceResults,
  drivers,
  currentUser,
  isEditing,
  setEditedPredictions,
  editedPredictions,
  totalHits,
  winner,
  handleSavePredictions
}) {
  const playerAliases = {
    Renato: "TATO",
    Sebastian: "TATAN",
    Enrique: "KIKE"
  };

const bonusKeys = ["udimpo", "podium", "hatTrick", "bullseye", "omen"];

const bonusIcons = {
  bullseye: "🐂",
  hatTrick: "🎩",
  udimpo: "💀",
  podium: "🏆",
  omen: "🔮"
};


  return (
    <TableContainer
      component={Paper}
      sx={{
        mt: 4,
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        bgcolor: "#1f2937",
      }}
    >

      <Table
        size="small"
        sx={{
          width: "100%",
          fontSize: { xs: "0.45rem", sm: "0.8rem" },
          tableLayout: "fixed",
          textAlign: "center"
        }}
      >

        <TableHead>
          <TableRow>
            <TableCell sx={{textAlign: "center", color: "white", fontWeight: "bold", width: "30%" }}>Categoría</TableCell>
            {players.map((player) => (
              <TableCell key={player} sx={{ textAlign: "center", color: "white", fontWeight: "bold", width: `${40 / players.length}%` }}>
                {playerAliases[player] || player}
              </TableCell>
            ))}
            <TableCell sx={{textAlign: "center", color: "white", fontWeight: "bold", width: "30%" }}>Resultados</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {categories &&
            Object.keys(categories).map((key) => (
              <React.Fragment key={key}>
                {key === "bullseye" && (
                  <TableRow>
                    <TableCell
                      colSpan={players.length + 2}
                      sx={{
                        borderBottom: "3px solid #9ca3af",
                        backgroundColor: "#111827",
                        py: 2,
                        textAlign: "center",
                        color: "#9ca3af",
                        fontWeight: "bold",
                        fontSize: "0.7rem",
                        letterSpacing: "0.05em",
                      }}
                    >
                      BONIFICACIONES
                    </TableCell>
                  </TableRow>
                )}

        <TableRow>
          <TableCell sx={{ textAlign: "center", color: "white", fontWeight: "bold" }}>
            {categories[key]}
          </TableCell>

          {players.map((player) => {
                const prediction = predictions && predictions.find((p) => p.user === player);
                const isBonusCategory = bonusKeys.includes(key);

                const bonusValue = isBonusCategory ? prediction?.[key] : null;
                const value = isBonusCategory
                    ? bonusValue ? "✔️" : "❌"               
                    : prediction?.[key] || "";

                const isArrayResult = Array.isArray(raceResults[key]);
                const isHit = !isBonusCategory && (
                    isArrayResult
                        ? raceResults[key]?.includes(prediction?.[key])
                        : prediction?.[key] === raceResults[key]
                );

                const cellColor = isBonusCategory
                    ? bonusValue
                        ? "#22c55e"
                        : "#374151"
                    : isHit
                    ? "#22c55e"
                    : prediction?.[key]
                    ? "#ef4444"
                    : "#374151";
                    console.log("Prediction completa:", prediction);
                return (
                <TableCell
                    key={player}
                    sx={{
                    bgcolor: cellColor,
                    color: "white",
                    fontWeight: "bold",
                    }}
                >
                    {/* ✅ MOSTRAR */}
                    {isBonusCategory ? (
                        value
                    ) : currentUser === player && isEditing ? (
                        <select
                            value={editedPredictions[player]?.[key] ?? prediction?.[key] ?? ""}
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


          <TableCell
            sx={{
              bgcolor: "#4b5563",
              fontWeight: "bold",
              color: "white",
            }}
          >
            {/* Mostrar resultados */}
            {key === "udimpo"
              ? "Total Aciertos:"
              : key === "podium"
              ? totalHits
              : key === "hatTrick"
              ? "Ganador Ronda:"
              : Array.isArray(raceResults[key])
              ? raceResults[key].length > 0
                ? raceResults[key].join(", ")
                : "-"
              : raceResults[key] || "-"}
          </TableCell>
        </TableRow>
                </React.Fragment>
              ))}

        <TableRow>
          <TableCell
            sx={{
              color: "white",
              fontWeight: "bold",
              borderTop: "2px solid #9ca3af",
              backgroundColor: "#111827",
            }}
          >
            PUNTOS
          </TableCell>
          {players.map((player) => {
            const prediction = predictions.find((p) => p.user.toLowerCase() === player.toLowerCase());
            return (
              <TableCell
                key={player}
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  borderTop: "2px solid #9ca3af",
                  backgroundColor: "#1f2937",
                }}
              >
                {prediction?.points ?? "-"}
                <BonusHUD prediction={prediction} />
              </TableCell>
            );
          })}
          <TableCell sx={{ backgroundColor: "#4b5563" }} />
        </TableRow>


        </TableBody>
      </Table>

      {isEditing && (
        <Box mt={2} textAlign="center">
          <Button
            onClick={handleSavePredictions}
            variant="contained"
            color="success"
          >
            Guardar Predicciones
          </Button>
        </Box>
      )}
    </TableContainer>
  );
}
