import * as React from "react";
import { Box, Typography, Card, CardContent, Button, Avatar } from "@mui/material";
import BottomNavBar from "../components/BottomNavBar";

export default function Stats() {
  return (
    <Box sx={{ bgcolor: "#0f0f0f", minHeight: "100vh", px: 2, py: 3, maxWidth: "1000px", mx: "auto", color: "white", pt: 4, pb: 9 }}>

      {/* Noticias */}
      <Card sx={{ bgcolor: "#191919", mb: 2, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>📰 </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Avatar variant="rounded" src="https://via.placeholder.com/100x60" sx={{ width: 100, height: 60 }} />
            <Box>
              <Typography variant="body2" fontWeight="bold">Verstappen se queja de la pista</Typography>
              <Typography variant="caption">Hace 2 horas</Typography>
            </Box>
          </Box>
       
        </CardContent>
      </Card>

      {/* Race Alert */}
      <Card sx={{ bgcolor: "#1f1f1f", mb: 2, border: "1px solid #444", borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6">🚨 </Typography>
          <Typography variant="h4" fontWeight="bold" color="primary">GP de Austria</Typography>
          <Typography variant="caption">Domingo 14:00hrs | 5 días restantes</Typography>
        </CardContent>
      </Card>

      {/* Stats Player */}
      <Card sx={{ bgcolor: "#1f1f1f", mb: 2, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6">👤 </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Box>
              <Typography variant="body2">Puntaje</Typography>
              <Typography variant="h5">1234 pts</Typography>
            </Box>
            <Box>
              <Typography variant="body2">Bonos</Typography>
              <Typography variant="h5">🏆 🥇 💨</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Bonos Comunes */}
      <Card sx={{ bgcolor: "#191919", mb: 2, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6">📊 Bonos más comunes</Typography>
          <Typography variant="body2" mt={1}>🏆 Fastest Lap - 75%</Typography>
          <Typography variant="body2">🥇 Pole Position - 65%</Typography>
          <Typography variant="body2">💨 Positions Gained - 40%</Typography>
        </CardContent>
      </Card>

      {/* Botón */}
      <Box textAlign="center" mt={2}>
        <Button variant="contained" color="primary" size="large" sx={{ borderRadius: "20px" }}>
          Ir a Predecir 🚦
        </Button>
      </Box>

      <BottomNavBar />
    </Box>
  );
}
