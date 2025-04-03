import * as React from "react";
import { Box, Typography, Card, CardContent, Button, Avatar } from "@mui/material";
import BottomNavBar from "../components/BottomNavBar";

export default function Stats() {
  return (
    <Box sx={{ bgcolor: "#0f0f0f", minHeight: "100vh", px: 2, py: 3, maxWidth: "1000px", mx: "auto", color: "white", pt: 4, pb: 9 }}>

      {/* Perfil del Jugador */}
      <Card sx={{ bgcolor: "#191919", mb: 2, borderRadius: 3, p: 2 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ width: 64, height: 64 }} src="https://via.placeholder.com/100" />
          <Box>
            <Typography variant="h5" fontWeight="bold">Renato</Typography>
            <Typography variant="body2" color="text.secondary">Puesto 1º | 1234 pts</Typography>
            <Typography variant="body2">Bonos: 🏆 🎯 🔮</Typography>
          </Box>
        </Box>
      </Card>

      {/* Noticias */}
      <Card sx={{ bgcolor: "#191919", mb: 2, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>📰 Noticias</Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Avatar variant="rounded" src="https://via.placeholder.com/100x60" sx={{ width: 100, height: 60 }} />
            <Box>
              <Typography variant="body2" fontWeight="bold">Verstappen se queja de la pista</Typography>
              <Typography variant="caption">Hace 2 horas</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Estadísticas personales */}
      <Card sx={{ bgcolor: "#1f1f1f", mb: 2, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6">📊 Stats Personales</Typography>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Box>
              <Typography variant="body2">Puntaje</Typography>
              <Typography variant="h5">1234 pts</Typography>
            </Box>
            <Box>
              <Typography variant="body2">Mejor resultado</Typography>
              <Typography variant="h5">🏆 1º lugar</Typography>
            </Box>
            <Box>
              <Typography variant="body2">Bonos</Typography>
              <Typography variant="h5">🎯 x3</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Historial y logros */}
      <Card sx={{ bgcolor: "#1f1f1f", mb: 2, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6">🏅 Logros</Typography>
          <Typography variant="body2" mt={1}>🏆 Hat Trick Leader</Typography>
          <Typography variant="body2">🎯 Más Bullseyes</Typography>
          <Typography variant="body2">🔮 Mejor Omen</Typography>
          <Typography variant="body2">🧠 Mejor Udimpo</Typography>
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
