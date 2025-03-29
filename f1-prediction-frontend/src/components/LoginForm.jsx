import React from "react";
import { Box, Button, MenuItem, Select, Typography } from "@mui/material";

const players = ["Renato", "Sebastian", "Enrique"]; // <- Puedes cambiar o cargar dinámico

export default function LoginForm({ onSelectPlayer }) {
  const [selectedPlayer, setSelectedPlayer] = React.useState("");

  return (
    <Box textAlign="center" mt={4}>
      <Typography variant="h6" mb={2}>Selecciona tu jugador</Typography>
      <Select
        value={selectedPlayer}
        onChange={(e) => setSelectedPlayer(e.target.value)}
        displayEmpty
        sx={{ width: 200, mb: 2 }}
      >
        <MenuItem value="" disabled>Seleccionar...</MenuItem>
        {players.map((player) => (
          <MenuItem key={player} value={player}>{player}</MenuItem>
        ))}
      </Select>
      <br />
      <Button
        variant="contained"
        color="primary"
        disabled={!selectedPlayer}
        onClick={() => onSelectPlayer(selectedPlayer)}
      >
        Entrar
      </Button>
    </Box>
  );
}
