import { Box, Typography, Paper, Grid, Chip } from "@mui/material";

export default function Stats() {
  return (
    <Box>
      <Typography variant="h5" sx={{ fontFamily: "'Barlow Condensed'", mb: 2 }}>Estadísticas</Typography>

      {/* === Cards principales === */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper sx={{ p: 2, bgcolor: "#1c1c1e", borderRadius: 3 }}>
            <Typography variant="subtitle1" color="gray">Predicciones Totales</Typography>
            <Typography variant="h4" fontWeight="bold">128</Typography>
          </Paper>
        </Grid>

        <Grid item xs={6}>
          <Paper sx={{ p: 2, bgcolor: "#1c1c1e", borderRadius: 3 }}>
            <Typography variant="subtitle1" color="gray">Bonus Totales</Typography>
            <Typography variant="h4" fontWeight="bold">47</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2, bgcolor: "#1c1c1e", borderRadius: 3 }}>
            <Typography variant="subtitle1" color="gray">Jugador con más puntos</Typography>
            <Typography variant="h5" fontWeight="bold">Sebastian</Typography>
            <Typography variant="caption" color="gray">312 puntos</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* === Top 3 Bonus === */}
      <Box mt={4}>
        <Typography variant="subtitle1" color="gray" mb={1}>Top 3 Bonus más obtenidos</Typography>
        <Paper sx={{ p: 2, bgcolor: "#1c1c1e", borderRadius: 3 }}>
          <Box display="flex" gap={1} flexWrap="wrap">
            <Chip label="🎯 Bullseye - 18 veces" sx={{ bgcolor: "#334155", color: "white" }} />
            <Chip label="🎩 Hat Trick - 15 veces" sx={{ bgcolor: "#334155", color: "white" }} />
            <Chip label="🔮 Omen - 14 veces" sx={{ bgcolor: "#334155", color: "white" }} />
          </Box>
        </Paper>
      </Box>

      {/* === Curiosidad === */}
      <Box mt={4}>
        <Typography variant="subtitle1" color="gray" mb={1}>Curiosidad de la Temporada</Typography>
        <Paper sx={{ p: 2, bgcolor: "#1c1c1e", borderRadius: 3 }}>
          <Typography variant="body2" color="white">
            El 35% de las predicciones acertaron el podio completo en Mónaco.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
