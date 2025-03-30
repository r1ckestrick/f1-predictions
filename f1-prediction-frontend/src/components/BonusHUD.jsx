import React from "react";
import { Box, Chip, Tooltip } from "@mui/material";

export default function BonusHUD({ prediction }) {
  if (!prediction) return null;

  const bonuses = [
    { key: "hatTrick", label: "🎩", title: "Hat Trick" },
    { key: "bullseye", label: "🎯", title: "Bullseye" },
    { key: "omen", label: "🔮", title: "Omen" },
    { key: "udimpo", label: "🧠", title: "Udimpo" },
    { key: "podium", label: "🏅", title: "Podium" },
  ];

  return (
    <Box
      mt={0.5}
      display="flex"
      flexWrap="wrap"
      gap={0.5}
      justifyContent="center"
      alignItems="center"
    >
      {bonuses.map((bonus) => {
        const value = prediction[bonus.key];
        if (!value) return null;

        const isBoolean = typeof value === "boolean";

        return (
          <Tooltip title={bonus.title} key={bonus.key}>
            <Chip
              label={isBoolean ? bonus.label : `${bonus.label} ${value}`}
              size="small"
              sx={{
                fontSize: "0.65rem",
                height: "20px",
                bgcolor: "#334155",
                color: "white",
                borderRadius: "12px",
              }}
            />
          </Tooltip>
        );
      })}
    </Box>
  );
}
