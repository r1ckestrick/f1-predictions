import { Box, Typography } from "@mui/material";

export default function ComingSoonPage({ title }) {
  return (
    <Box sx={{ bgcolor: "#0f0f0f", minHeight: "100vh", px: 2, py: 3, maxWidth: "1000px", mx: "auto", color: "white", textAlign: "center" }}>
      <Typography variant="h4" sx={{ fontFamily: "'Barlow Condensed'", fontWeight: "bold", mb: 2 }}>
        {title}
      </Typography>
      <Typography variant="body1" color="gray">
        Próximamente!
      </Typography>
    </Box>
  );
}
