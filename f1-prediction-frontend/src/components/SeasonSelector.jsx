import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function SeasonSelector({ selectedSeason, setSelectedSeason, seasons }) {
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
        <InputLabel 
          id="season-select-label" 
          sx={{ fontWeight: "900", color: "white" }} // ← arreglado
        >
          Año
        </InputLabel>
        <Select
          labelId="season-select-label"
          id="season-select"
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
          sx={{ 
            color: "white", 
            "& .MuiSelect-icon": { color: "white" }, // ← flecha blanca
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "white" }
          }}
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
