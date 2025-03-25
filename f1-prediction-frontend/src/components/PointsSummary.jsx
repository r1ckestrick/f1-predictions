import React from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

const PointsSummary = ({ predictions, calculatePoints }) => {
  return (
    <Box mt={4}>
      <Typography variant="h6" sx={{ color: "white", fontWeight: "bold", mb: 2 }}>
        PUNTAJE FINAL
      </Typography>
      <TableContainer component={Paper} sx={{ bgcolor: "#1f2937" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Jugador</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Puntos</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {predictions.map((p) => (
              <TableRow key={p.user}>
                <TableCell sx={{ color: "white" }}>{p.user}</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  {calculatePoints ? calculatePoints(p) : p.points || 0}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PointsSummary;
