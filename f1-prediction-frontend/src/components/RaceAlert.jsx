import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function RaceAlert({ race }) {
  const [now, setNow] = useState(dayjs().tz("UTC"));

  useEffect(() => {
    const interval = setInterval(() => setNow(dayjs().tz("UTC")), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!race || !race.date) return null;

  const raceDate = dayjs(`${race.date}T14:00:00Z`);
  const qualyDate = raceDate.subtract(1, "day").hour(14);
  const fp3Date = raceDate.subtract(1, "day").hour(11);
  const fp2Date = raceDate.subtract(2, "day").hour(14);
  const fp1Date = raceDate.subtract(2, "day").hour(11);

  const ranges = [
    { name: "FP1", icon: "🟢", start: fp1Date, end: fp1Date.add(1.5, "hour") },
    { name: "FP2", icon: "🟢", start: fp2Date, end: fp2Date.add(1.5, "hour") },
    { name: "FP3", icon: "🟢", start: fp3Date, end: fp3Date.add(1.5, "hour") },
    { name: "Qualy", icon: "🔴", start: qualyDate, end: qualyDate.add(2, "hour") },
    { name: "Carrera", icon: "🚦", start: raceDate, end: raceDate.add(2, "hour") },
  ];

  let label = "⏳ Próxima sesión no definida";
  let styleColor = "#ff4655";

  // En vivo
  for (const session of ranges) {
    if (now.isAfter(session.start) && now.isBefore(session.end)) {
      label = `${session.icon} ${session.name} en vivo`;
      break;
    }
  }

  // Próxima sesión
  if (label.includes("no definida")) {
    const next = ranges.find(r => now.isBefore(r.start));
    if (next) {
      const diffSeconds = next.start.diff(now, "second");
      const hours = Math.floor(diffSeconds / 3600);
      const minutes = Math.floor((diffSeconds % 3600) / 60);
      const seconds = diffSeconds % 60;

      let timeText = "";
      if (hours > 0) timeText += `${hours}h `;
      if (minutes > 0 || hours > 0) timeText += `${minutes}m `;
      timeText += `${seconds}s`;

      label = `⏱️ ${next.name} en ${timeText}`;
    } else {
      label = race.has_official_results ? "🏁 Carrera finalizada" : "🏁 Carrera completada";
    }
  }

  return (
    <Box
      sx={{
        bgcolor: styleColor,
        border: `1px solid ${styleColor}`,
        borderRadius: 3,
        px: 1,
        py: 0.3,
        mb: 1,
        opacity: "85%",
        textAlign: "center",
        boxShadow: "0 0 8px rgba(39, 39, 39, 0.04)"
      }}
    >
      <Typography
        variant="caption"
        color="white"
        fontWeight="bold"
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={1}
      >
        {label}
      </Typography>
    </Box>
  );
}
