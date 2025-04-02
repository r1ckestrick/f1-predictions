// src/components/LoaderOverlay.jsx
import { Box, CircularProgress } from "@mui/material";
import { useLoader } from "../context/LoaderContext";

export default function LoaderOverlay() {
    const { loading } = useLoader();

    if (!loading) return null;

    return (
        <Box sx={{
          position: "fixed",
          top: "60px", // altura de tu TopNavBar (ajústalo si es necesario)
          bottom: "70px", // altura de tu BottomNavBar
          left: 0,
          right: 0,
          bgcolor: "rgba(39, 39, 39, 0.95)",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
            <CircularProgress size={80} color="primary" />
        </Box>
    );
}
