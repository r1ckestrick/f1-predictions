import * as React from "react";
import { Box, Typography, Card, Avatar, Divider } from "@mui/material";
import BottomNavBar from "../components/BottomNavBar";
import ExtendedNextRaceCard from "../components/ExtendedNextRaceCard";

import avatarImg from "../assets/images/tato.jpg";
import emblem1 from "../assets/images/emblem1.png";

export default function Stats() {
  return (
    <Box
      sx={{
        position: "fixed",
        bgcolor: "#0f0f0f",
        minHeight: "100vh",
        px: 2,
        py: 3,
        maxWidth: "1000px",
        mx: "auto",
        color: "white",
        pt: 4,
        pb: 9,
      }}
    >
     

      {/* 🔹 PERFIL COMPLETO DEL JUGADOR */}
      <Card
        sx={{
          marginTop: 5,
          mb: 3,
          borderRadius: 4,
          background: "linear-gradient(180deg, #1a1a1a, #0f0f0f)",
          boxShadow: "0 0 20px rgba(255,255,255,0.05)",
          p: 3,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            sx={{ width: 72, height: 72, border: "2px solid #fff" }}
            src={avatarImg}
          />
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Renato
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <img src={emblem1} alt="rango" style={{ width: 24 }} />
              <Typography variant="body2" color="text.secondary">
                Rango: Elite Predictor
              </Typography>
            </Box>
            <Typography variant="body2">Puesto 1º | 1234 pts</Typography>
            <Typography variant="body2">
              Bonos: 🎩 x2 🎯 x4 🔮 x1
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2, borderColor: "#333" }} />

        <Box display="flex" justifyContent="space-around">
          <Box textAlign="center">
            <Typography variant="caption" color="text.secondary">
              Predicciones
            </Typography>
            <Typography variant="h6">45</Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="caption" color="text.secondary">
              Aciertos
            </Typography>
            <Typography variant="h6">31</Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="caption" color="text.secondary">
              Accuracy
            </Typography>
            <Typography variant="h6">68%</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2, borderColor: "#333" }} />

      </Card>

      {/* 🔹 PRÓXIMA CARRERA EXTENDIDA */}
      <ExtendedNextRaceCard />

      <BottomNavBar />
    </Box>
  );
}
