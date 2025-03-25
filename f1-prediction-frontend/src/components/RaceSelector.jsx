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
        <InputLabel id="race-select-label" sx={{ fontWeight: "900", color: "Gray" }}>
          Carrera
        </InputLabel>
        <Select
          labelId="race-select-label"
          value={selectedRace}
          onChange={(e) => setSelectedRace(e.target.value)}
          sx={{ color: "white", borderColor: "white" }}
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
