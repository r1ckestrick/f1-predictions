import { Box, Typography, Card, Button } from "@mui/material";
import { RACE_IMAGES } from "../data/raceImages";
import RaceAlert from "./RaceAlert";
import useRaceData from "../hooks/useRaceData";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";  // plugin para UTC
import timezone from "dayjs/plugin/timezone";  // plugin para zonas horarias
import { useNavigate } from "react-router-dom"; // Usar useNavigate en lugar de useHistory

// Extiende dayjs para usar UTC y timezone
dayjs.extend(utc);
dayjs.extend(timezone);

const fallbackImage = "/mock-silverstone.jpeg";

function formatSession(dateStr, timeStr) {
  if (!dateStr || !timeStr) {
    console.warn("⛔ Faltan datos de fecha o tiempo:", { dateStr, timeStr });
    return "-";
  }
  try {
    // Verifica si la fecha y la hora se han recibido correctamente y luego las convierte a un formato dayjs
    const date = dayjs(`${dateStr}T${timeStr}`).tz("America/Santiago", true); // Convertir a hora de Chile y forzar parsing
    if (!date.isValid()) {
      console.warn("⛔ Fecha inválida:", dateStr, timeStr);
      return "-";
    }
    return date.format("ddd HH:mm"); // Formato: día abreviado, hora y minutos
  } catch (err) {
    console.error("Error formateando sesión:", err);
    return "-";
  }
}

function getFlagEmoji(countryName) {
  const countryCode = COUNTRY_CODES[countryName];

  if (!countryCode) return ""; // Si no encuentra código de país, devuelve vacío

  return String.fromCodePoint(
    0x1f1e6 + countryCode.charCodeAt(0) - 65,  // Esto genera la primera parte del código de la bandera
    0x1f1e6 + countryCode.charCodeAt(1) - 65   // Esto genera la segunda parte del código de la bandera
  );
}

const COUNTRY_CODES = {
  "Japan": "JP",
  "Italy": "IT",
  "Australia": "AU",
  "USA": "US",
  "United States": "US",
  "Spain": "ES",
  "UK": "GB",
  "Canada": "CA",
  "France": "FR",
  "Germany": "DE",
  "Qatar": "QA",
  "Brazil": "BR",
  "Mexico": "MX",
  "UAE": "AE",
  "China": "CN",
  "Belgium": "BE",
  "Netherlands": "NL",
  "Saudi Arabia": "SA",
  "Singapore": "SG",
  "Austria": "AT",
  "Monaco": "MC"
};

export default function ExtendedNextRaceCard() {
  const { nextRace } = useRaceData(2025);
  const navigate = useNavigate();  // Usar useNavigate para la redirección

  if (!nextRace) return null;

  const raceAssets = RACE_IMAGES[nextRace.raceName] || {};
  const backgroundImage = raceAssets.background || fallbackImage;
  const circuitOverlay = raceAssets.circuit || null;
  const location = nextRace?.location || "-";

  // Redirigir a la página de predicciones al hacer clic en el botón
  const handlePredictClick = () => {
    navigate("/");  // Cambié la ruta a "/" para ir a Home.jsx
  };

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 4,
        p: 0,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        overflow: "hidden",
        color: "white"
      }}
    >
      {/* Overlay oscuro */}
      <Box sx={{ position: "absolute", inset: 0, background: "rgba(0, 0, 0, 0.69)" }} /> {/* Menos opacidad */}

      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          pt: 4,
        }}
      >
        {/* Left - Info carrera */}
        <Box flex={3} pr={2} minWidth={0}>
          <Box mb={1} sx={{ width: "100%", maxWidth: "100%" }}>
            {nextRace && <RaceAlert race={nextRace} />}
          
          </Box>
          <Typography variant="overline" color="text.secondary">Próxima carrera</Typography>
          <Typography variant="h3" fontWeight="bold">
            {nextRace?.raceName.replace(" Grand Prix", " GP")}
          </Typography>
          <Typography variant="body2">Ronda {nextRace?.round} · {nextRace?.Circuit?.circuitName}</Typography>
          <Typography variant="caption" color="text.secondary">
            {getFlagEmoji(nextRace?.location)} {location}
          </Typography>
        </Box>

        {/* Right - Circuito */}
        {circuitOverlay && (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "right" }}>
            <img
              src={circuitOverlay}
              alt="Circuit"
              style={{
                background: "rgba(0, 0, 0, 0.39)",
                borderRadius: 5,
                height: 150,
                opacity: 0.9,
                filter: "drop-shadow(0 0 3px black)",
              }}
            />
          </Box>
        )}
      </Box>

      {/* 🕒 Horarios en ancho completo */}
      <Box px={3} pb={2}>
        <Typography variant="caption"sx={{ opacity: 0.9 }}>🗓️</Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}> {/* Menos opacidad */} 
          FP1: {formatSession(nextRace?.FirstPractice?.date, nextRace?.FirstPractice?.time)} · FP2: {formatSession(nextRace?.SecondPractice?.date, nextRace?.SecondPractice?.time)}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          FP3: {formatSession(nextRace?.ThirdPractice?.date, nextRace?.ThirdPractice?.time)} · Qualy: {formatSession(nextRace?.Qualifying?.date, nextRace?.Qualifying?.time)}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Carrera: {formatSession(nextRace?.date, nextRace?.time)}
        </Typography>
      </Box>

      {/* Botón barra inferior */}
            <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/stats")}
        fullWidth
        sx={{ mt: 2 }}
      >
        Predecir
      </Button>


    </Card>
  );
}
