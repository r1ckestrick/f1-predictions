import React from "react";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export default function RaceSelector({ races, selectedRace, setSelectedRace }) {
  if (!races || races.length === 0) return null;
  return (
    <Box mt={3} textAlign="center">
      <FormControl
        fullWidth
        sx={{
          bgcolor: "#1f2937",
          color: "white",
          maxWidth: 400,
          mx: "auto",
        }}
      >
        <InputLabel 
          id="race-select-label" 
          sx={{ fontWeight: "900", color: "white" }} // ← cambiamos a blanco
        >
          Carrera
        </InputLabel>
        <Select
          labelId="race-select-label"
          value={selectedRace}
          onChange={(e) => setSelectedRace(e.target.value)}
          sx={{ 
            color: "white", 
            "& .MuiSelect-icon": { color: "white" }, // ← flecha blanca
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" }, // ← borde blanco
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "white" }
          }}
        >
          {races.map((race) => (
            <MenuItem key={race.round} value={race.round}>
              {race.raceName} – {race.round}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
