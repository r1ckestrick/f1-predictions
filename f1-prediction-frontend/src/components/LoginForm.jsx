import React from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";

const LoginForm = ({ onLogin }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    onLogin(username, password);
  };

  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{
        bgcolor: "#1f2937",
        p: 4,
        maxWidth: 400,
        mx: "auto",
        textAlign: "center",
        mt: 8,
      }}
    >
      <Typography variant="h5" color="white" gutterBottom>
        🔒 Iniciar Sesión
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          name="username"
          label="Usuario"
          variant="outlined"
          fullWidth
          margin="normal"
          InputLabelProps={{ style: { color: "#ccc" } }}
          InputProps={{ style: { color: "white" } }}
        />
        <TextField
          name="password"
          label="Contraseña"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          InputLabelProps={{ style: { color: "#ccc" } }}
          InputProps={{ style: { color: "white" } }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Entrar
        </Button>
      </form>
    </Box>
  );
};

export default LoginForm;
