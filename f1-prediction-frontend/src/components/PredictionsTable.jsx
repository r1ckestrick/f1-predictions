import React from "react";
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
  checkBonuses,
  calculatePoints,
  totalHits,
  winner,
  handleSavePredictions
}) {
  const playerAliases = {
    Renato: "TATO",
    Sebastian: "TATAN",
    Enrique: "KIKE"
  };
  
  return (
    <TableContainer
  component={Paper}
  sx={{
    mt: 4,
    width: "100%",
    maxWidth: "100vw", // Nunca más ancho que la pantalla
    overflowX: "hidden", // Evita el scroll horizontal
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
                    const prediction =
                      predictions &&
                      predictions.find((p) => p.user === player);
                    const isBonusCategory = [
                      "udimpo",
                      "podium",
                      "hatTrick",
                      "bullseye",
                      "omen",
                    ].includes(key);
                    const bonusCheck =
                      checkBonuses(prediction)[key] ? "✔️" : "❌";
                    const value = prediction ? prediction[key] || "-" : "-";

                    const cellColor = isBonusCategory
                      ? checkBonuses(prediction)[key]
                        ? "#22c55e"
                        : "#374151"
                      : raceResults[key] && prediction?.[key] === raceResults[key]
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

                  <TableCell
                    sx={{
                      bgcolor: "#4b5563",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    {key === "udimpo"
                      ? "Total Aciertos:"
                      : key === "podium"
                      ? totalHits
                      : key === "hatTrick"
                      ? "Ganador Ronda:"
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
              const prediction = predictions.find(
                (p) => p.user.toLowerCase() === player.toLowerCase()
              );
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
