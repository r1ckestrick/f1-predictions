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
  let color = "";
  let icon = "";


  // ✅ Carrera finalizada
  if (today.isAfter(raceDate, 'day')) {
    status = raceData.has_official_results
      ? "Carrera finalizada con resultados oficiales"
      : "Carrera finalizada (sin resultados oficiales)";
    color = "grey";
    icon = "✅";
  }
  // 🟣 Carrera en vivo (día de carrera)
  if (today.isSame(raceDate, 'day')) {
    status = "Carrera en vivo!";
    color = "red";
    icon = "🏁";
  }
  // 🔴 Qualy en vivo (día de qualy)
  if (today.isSame(qualyDate, 'day')) {
    status = "Qualy en vivo!";
    color = "purple";
    icon = "🔴";
  }
  // ⏱️ Faltan horas para la carrera (entre qualy y carrera)
  if (today.isAfter(qualyDate) && today.isBefore(raceDate)) {
    status = "Faltan horas para la carrera";
    color = "orange";
    icon = "⏱️";
  }
  // ⏱️ Faltan horas para la qualy (si es el día anterior pero ya es hora cercana)
  if (qualyDate.diff(today, 'day') === 0) {
    status = "Faltan horas para la qualy";
    color = "blue";
    icon = "🟣";
  }
  // ⏳ Todavía puedes predecir (más de un día antes)
  if (today.isBefore(qualyDate)) {
    const daysLeft = qualyDate.diff(today, 'day');
    status = `Quedan ${daysLeft} día${daysLeft > 1 ? 's' : ''} para hacer tu predicción.`;
    color = "green";
    icon = "⏳";
  }
  
  return (
    <Box
      sx={{
        bgcolor: `${color}.800` || "#1c1c1e",
        border: `1px solid ${color}`,
        borderRadius: 3.5,
        p: 0.7,
        mb: 2,
        textAlign: "center",
        boxShadow: "0 0 8px rgba(255,255,255,0.1)",
      }}
    >
      <Typography variant="caption" color="white" fontWeight="bold" display="flex" alignItems="center" justifyContent="center" gap={1}>
        {icon} {status}
      </Typography>
    </Box>
  );
}
