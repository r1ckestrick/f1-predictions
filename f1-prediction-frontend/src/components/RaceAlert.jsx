import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";

export default function RaceAlert({ race: raceData }) {

  if (!raceData || !raceData.date) return "Sin información";

  // 👇 Esto es clave para que funcione bien con dayjs
  const today = dayjs();
  const raceDate = dayjs(raceData.date + "T12:00:00");
  const qualyDate = raceDate.subtract(1, "day");
  
  //  👀 Aquí puedes cambiar el color del alert creo?
  let status = "";
  let icon = "";


  // 🏁 Carrera finalizada
  if (today.isAfter(raceDate, 'day')) {
    status = raceData.has_official_results
      ? "Carrera finalizada"
      : "Carrera finalizada";
    icon = "🏁";
  }
  // 🚦 Carrera en vivo (día de carrera)
  if (today.isSame(raceDate, 'day')) {
    status = "Carrera en vivo!";
    icon = "🚦";
  }
  // 🔴 Qualy en vivo (día de qualy)
  if (today.isSame(qualyDate, 'day')) {
    status = "Qualy en vivo!";
    icon = "🔴";
  }
  // ⏱️ Faltan horas para la carrera (entre qualy y carrera)
  if (today.isAfter(qualyDate) && today.isBefore(raceDate)) {
    status = "Faltan horas para la carrera";
    icon = "⏱️";
  }
  // ⏱️ Faltan horas para la qualy (si es el día anterior pero ya es hora cercana)
  if (qualyDate.diff(today, 'day') === 0) {
    status = "Faltan horas para la qualy";
        icon = "⏱️";
  }
  // ⏳ Todavía puedes predecir (más de un día antes)
  if (today.isBefore(qualyDate)) {
    const daysLeft = qualyDate.diff(today, 'day');
    status = `Quedan ${daysLeft} día${daysLeft > 1 ? 's' : ''} para hacer tu predicción.`;
        icon = "⏳";
  }
  
  return (
    <Box
      sx={{
        bgcolor: `#ff4655` || "#1c1c1e",
        border: `1px solid #ff4655`,
        borderRadius: 3,
        px: 1,
        py: 0.3,
        mb: 1,
        opacity: "85%",
        textAlign: "center",
        boxShadow: "0 0 8px rgba(39, 39, 39, 0.04)",
      }}
    >
      <Typography variant="caption" color="white" fontWeight="bold" display="flex" alignItems="center" justifyContent="center" gap={1}>
        {icon} {status}
      </Typography>
    </Box>
  );
}
