
import React from "react";
import { MenuItem, Select, Box, Avatar } from "@mui/material";

export default function DriverSelector({ drivers, value, onChange }) {
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      displayEmpty
      size="small"
      sx={{
        backgroundColor: "rgba(255,255,255,0.05)",
        color: value ? "#ff4655" : "white",
        borderRadius: "4px",
        width: "100%",
        fontSize: "0.75rem",
        height: "24px",
        border: "1px solid rgba(255,70,85,0.4)",
        outline: "none",
        appearance: "none",
        textAlignLast: "center",
        transition: "all 0.2s ease",
        cursor: "pointer",
        '& svg': { color: "#ff4655" }
      }}
    >
      <MenuItem value="">
        <em>-</em>
      </MenuItem>
      {drivers.map(driver => (
        <MenuItem key={driver.code} value={driver.code}>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              src={`/logos/${driver.team}.png`}
              alt={driver.team}
              sx={{ width: 16, height: 16 }}
            />
            {driver.code}
          </Box>
        </MenuItem>
      ))}
    </Select>
  );
}
