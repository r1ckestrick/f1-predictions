import React from "react";
import { Box, Button, Typography } from "@mui/material";

const players = ["Renato", "Sebastian", "Enrique"];
const admins = ["Renato"]; 

export default function LoginForm({ onSelectPlayer }) {
  return (
    <Box
      textAlign="center"
      mt={10}
      p={4}
      sx={{
        bgcolor: "#1c1c1e",
        borderRadius: 3,
        boxShadow: "0 0 10px rgba(255,255,255,0.05)",
        maxWidth: 400,
        mx: "auto",
      }}
    >
      <Typography
        variant="h6"
        mb={3}
        sx={{ fontFamily: "'Barlow Condensed'", color: "white" }}
      >
        ¿Quién eres?
      </Typography>

      {players.map((player) => (
        <Button
          key={player}
          variant="contained"
          color="primary"
          onClick={() => onSelectPlayer({ name: player, isAdmin: admins.includes(player) })}
          fullWidth
          sx={{
            mb: 1.5,
            fontFamily: "'Barlow Condensed'",
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          {player}
        </Button>
      ))}
    </Box>
  );
}
