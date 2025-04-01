// src/pages/Leaderboard.jsx
import { Box, Typography, Avatar, Paper, List, ListItem, ListItemAvatar, ListItemText, Chip, Tooltip, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { PLAYERS } from "../data/players";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import RemoveIcon from '@mui/icons-material/Remove';


const BONUS = [
  { key: "hatTrick", label: "🎩", title: "Hat Trick" },
  { key: "bullseye", label: "🎯", title: "Bullseye" },
  { key: "omen", label: "🔮", title: "Omen" },
  { key: "udimpo", label: "🧠", title: "Udimpo" },
  { key: "podium", label: "🏅", title: "Podium" },
];

// 📦 Dummy Data
const dummySeasons = ["2023", "2024"];
const dummyPlayers = [
  {
    name: "Renato",
    total_points: 120,
    bonus_count: { hatTrick: 2, bullseye: 3, omen: 1 },
    prevRank: 2,
    currentRank: 1,
  },
  {
    name: "Sebastian",
    total_points: 95,
    bonus_count: { hatTrick: 1, podium: 4 },
    prevRank: 1,
    currentRank: 2,
  },
  {
    name: "Enrique",
    total_points: 70,
    bonus_count: { udimpo: 2, podium: 1 },
    prevRank: 3,
    currentRank: 3,
  },
];

export default function Leaderboard() {
  const [season, setSeason] = useState("2024");

  const sorted = [...dummyPlayers].sort((a, b) => b.total_points - a.total_points);

  return (
    <Box>
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" sx={{ fontFamily: "'Barlow Condensed'" }}>Leaderboard</Typography>
        <Select
          size="small"
          value={season}
          onChange={e => setSeason(e.target.value)}
          displayEmpty
          sx={{ color: "white", bgcolor: "#1c1c1e", borderRadius: 1 }}
        >
          {dummySeasons.map(s => (<MenuItem key={s} value={s}>{s}</MenuItem>))}
        </Select>
      </Box>

      <Paper sx={{ bgcolor: "#1c1c1e", borderRadius: 3, boxShadow: "0 0 10px rgba(0,0,0,0.3)" }}>
        <List>
          {sorted.map((player, index) => (
            <ListItem key={player.name} sx={{ borderBottom: "1px solid #333", alignItems: "flex-start" }}>
              <ListItemAvatar>
                <Avatar src={PLAYERS[player.name]?.image} alt={player.name} />
              </ListItemAvatar>

              <ListItemText
                primary={`${index + 1}. ${player.name}`}
                secondary={`${player.total_points} puntos`}
                primaryTypographyProps={{ fontFamily: "'Barlow Condensed'", fontWeight: "bold", color: "white" }}
                secondaryTypographyProps={{ fontFamily: "'Barlow Condensed'", color: "#aaa" }}
              />

              {/* Flechita */}
              <Box display="flex" alignItems="center" mr={1}>
                {player.prevRank > player.currentRank && <ArrowDropUpIcon sx={{ color: "#30d158" }} />}
                {player.prevRank < player.currentRank && <ArrowDropDownIcon sx={{ color: "#ff453a" }} />}
                {player.prevRank === player.currentRank && <RemoveIcon sx={{ color: "#999" }} />}
              </Box>

              {/* Bonus HUD */}
              <Box display="flex" gap={0.5} flexWrap="wrap">
                {BONUS.map(b => player.bonus_count[b.key] && (
                  <Tooltip title={`${b.title}: ${player.bonus_count[b.key]}`} key={b.key}>
                    <Chip
                      label={`${b.label} ${player.bonus_count[b.key]}`}
                      size="small"
                      sx={{ fontSize: "0.65rem", height: "20px", bgcolor: "#334155", color: "white", borderRadius: "12px" }}
                    />
                  </Tooltip>
                ))}
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
