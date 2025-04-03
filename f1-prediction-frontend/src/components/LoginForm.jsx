import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { PLAYERS } from "../data/players";
import { useUser } from "../context/UserContext";

export default function LoginForm() {
  const { selectUser } = useUser();
  const players = Object.keys(PLAYERS);

  return (
    <Box
      textAlign="center"
      mt={10}
      p={4}
      sx={{
        bgcolor: "background.paper",
        borderRadius: 4,
        boxShadow: "0 0 12px rgba(0,0,0,0.3)",
        maxWidth: 400,
        mx: "auto",
      }}
    >
      <Typography
        variant="h6"
        mb={3}
        sx={{ fontFamily: "'Barlow Condensed'", color: "text.primary" }}
      >
        ¿Quién eres?
      </Typography>

      {players.map((player) => (
        <Button
          key={player}
          variant="contained"
          color="primary"
          onClick={() => selectUser({ name: player, isAdmin: player === "Renato" })}
          fullWidth
          sx={{
            mb: 1.5,
            fontFamily: "'Barlow Condensed'",
            fontWeight: "bold",
            textTransform: "none",
            borderRadius: 2,
            boxShadow: "0 0 4px rgba(0,0,0,0.2)",
            "&:hover": {
              boxShadow: "0 0 8px rgba(255,70,85,0.5)",
              transform: "scale(1.02)",
            },
            transition: "all 0.2s ease",
          }}
        >
          {player}
        </Button>
      ))}
    </Box>
  );
}
