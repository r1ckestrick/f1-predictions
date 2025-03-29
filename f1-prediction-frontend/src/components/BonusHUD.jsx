// src/components/BonusHUD.jsx
import React from "react";
import { Tooltip, Box } from "@mui/material";

const bonusIcons = {
  bullseye: { icon: "🐂", label: "Bullseye (BOR + MFM acertados)" },
  hatTrick: { icon: "🎩", label: "Hat-Trick (Pole + P1 + Fastest Lap)" },
  udimpo: { icon: "💀", label: "UdImPo (Podium sin orden exacto)" },
  podium: { icon: "🏆", label: "Podium exacto" },
  omen: { icon: "🔮", label: "OMEN (10 aciertos)" },
};

export default function BonusHUD({ prediction }) {
  if (!prediction) return null;

  // Si tiene omen, solo mostramos el omen
  if (prediction.omen) {
    return (
      <Box sx={{ mt: 0.5, fontSize: "1.8rem", textAlign: "center" }}>
        <Tooltip title={bonusIcons.omen.label} arrow placement="top">
          <span>{bonusIcons.omen.icon}</span>
        </Tooltip>
      </Box>
    );
  }

  // Si no, mostramos los bonus normales
  return (
    <Box sx={{ mt: 0.5, fontSize: "0.9rem", display: "flex", gap: "0.2rem", justifyContent: "center", flexWrap: "wrap" }}>
      {Object.entries(bonusIcons).map(([key, { icon, label }]) => (
        key !== "omen" && prediction?.[key] && (
          <Tooltip key={key} title={label} arrow placement="top">
            <span>{icon}</span>
          </Tooltip>
        )
      ))}
    </Box>
  );
}
