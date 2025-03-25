import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function SeasonSelector({ selectedSeason, seasons, setSelectedSeason }) {
  if (!seasons || seasons.length === 0) return null;

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
        <InputLabel id="season-select-label" sx={{ fontWeight: "900", color: "Gray" }}>
          Año
        </InputLabel>
        <Select
          labelId="season-select-label"
          id="season-select"
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
          label="Año"
          sx={{ color: "white", borderColor: "white" }}
        >
          {seasons.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
