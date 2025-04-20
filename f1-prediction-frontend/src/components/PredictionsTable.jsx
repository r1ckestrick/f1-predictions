import React, { useState } from "react";
import BonusHUD from "./BonusHUD";
import NextRaceCard from "./NextRaceCard";
import ExtendedNextRaceCard from "./ExtendedNextRaceCard";
import DriverSelector from "./DriverSelector";
import { PLAYERS } from "../data/players";
import {
  Avatar,
  Tooltip,
  Dialog,
  IconButton,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  handleSavePredictions,
  hasOfficialResults,
  nextRace,
}) {
  const bonusKeys = ["udimpo", "podium", "hatTrick", "bullseye", "omen"];
  const visibleCategories = Object.keys(categories).filter(key => !bonusKeys.includes(key));
  const safeResults = raceResults || {};
  const qualyDatetime = nextRace?.Qualifying?.date && nextRace?.Qualifying?.time
    ? dayjs(`${nextRace.Qualifying.date}T${nextRace.Qualifying.time}`)
    : null;
  const isPredictionClosed = qualyDatetime ? dayjs().isAfter(qualyDatetime) : false;

  const [openModal, setOpenModal] = useState(false);

  return (
    <Box>
      {/* 🔹 NextRaceCard que abre el popup */}
      {nextRace && (
        <Box mb={2} onClick={() => setOpenModal(true)} sx={{ cursor: "pointer" }}>
          <NextRaceCard race={nextRace} />
        </Box>
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
              <TableCell sx={cellStickyLeft}>🏁</TableCell>
              {players.map((player, i) => (
                <TableCell key={player} sx={cellPlayer(i, players.length)}>
                  <Tooltip title={player}>
                    <Avatar src={PLAYERS[player]?.image} alt={player} sx={avatarStyle} />
                  </Tooltip>
                </TableCell>
              ))}
              <TableCell sx={cellStickyRight}>✔️</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleCategories.map(key => (
              <TableRow key={key}>
                <TableCell sx={cellStickyLeft}>{categories[key]}</TableCell>
                {players.map(player => {
                  const prediction = predictions.find(p => p.user.toLowerCase() === player.toLowerCase());
                  const value = prediction?.[key] || "";
                  const isArrayResult = Array.isArray(safeResults[key]);
                  const isHit = safeResults[key] && (isArrayResult ? safeResults[key]?.includes(value) : safeResults[key] === value);
                  const cellColor = !safeResults[key] ? "background.default" : isHit ? "primary.main" : value ? "#2c2c2c" : "background.default";
                  console.log("🟢 Predicciones (debug):", predictions);

                  return (
                    <TableCell key={player} sx={cellBody(cellColor)}>
                      {isEditing && !isPredictionClosed && (currentUser?.isAdmin || currentUser?.name === player) ? (
                        <DriverSelector
                          drivers={drivers}
                          value={editedPredictions[player]?.[key] ?? value}
                          onChange={(newValue) => setEditedPredictions(prev => ({
                            ...prev,
                            [player]: { ...prev[player], [key]: newValue }
                          }))}
                        />
                      ) : value}
                    </TableCell>
                  );
                })}
                <TableCell sx={cellStickyRight}>
                  {Array.isArray(safeResults[key]) ? safeResults[key]?.join(", ") : safeResults[key] || "-"}
                </TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell sx={cellStickyLeft}>Puntaje</TableCell>
              {players.map(player => {
                const prediction = predictions.find(p => p.user.toLowerCase() === player.toLowerCase());
                return (
                  <TableCell key={player} sx={cellBody("background.paper")}>
                    {prediction?.points ?? "-"} <BonusHUD prediction={prediction?.bonuses ? { ...prediction, ...prediction.bonuses } : prediction} />
                  </TableCell>
                );
              })}
              <TableCell sx={cellStickyRight} />
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* 🔹 POPUP EXTENDIDO */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        TransitionComponent={Transition}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            bgcolor: "#121212",
            borderRadius: 3,
            p: 2,
            position: "relative"
          }
        }}
      >
        <IconButton
          onClick={() => setOpenModal(false)}
          sx={{ position: "absolute", top: 8, right: 8, color: "white" }}
        >
          <CloseIcon />
        </IconButton>
        <ExtendedNextRaceCard race={nextRace} />
      </Dialog>
    </Box>
  );
}

// ✅ Estilos reutilizables
const cellStickyLeft = {
  position: "sticky",
  left: 0,
  bgcolor: "background.default",
  color: "text.primary",
  fontWeight: "bold",
  textAlign: "center",
  borderRight: "1px solid rgba(255,70,85,0.4)"
};

const cellStickyRight = {
  position: "sticky",
  right: 0,
  bgcolor: "background.default",
  color: "text.primary",
  fontWeight: "bold",
  textAlign: "center",
  borderLeft: "1px solid rgba(255,70,85,0.4)"
};

const cellPlayer = (i, total) => ({
  color: "text.secondary",
  fontWeight: "bold",
  textAlign: "center",
  borderRight: i < total - 1 ? "1px solid rgba(255,70,85,0.4)" : undefined
});

const avatarStyle = {
  width: 24,
  height: 24,
  mx: "auto",
  border: "1px solid rgba(255,70,85,0.4)"
};

const cellBody = (bgcolor) => ({
  bgcolor,
  color: "text.primary",
  fontWeight: "bold",
  textAlign: "center",
  borderRight: "1px solid rgba(255,70,85,0.4)"
});
