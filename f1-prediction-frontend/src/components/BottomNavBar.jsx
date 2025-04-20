import { BottomNavigation, BottomNavigationAction, Paper, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Home, Trophy, Archive, Goal, Menu } from "lucide-react";
import MenuSidebar from "./MenuSidebar"; 

export default function BottomNavBar({ user, onAdminMode, onChangeUser, onLogout }) {
  const navigate = useNavigate();
  const [value, setValue] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes("stats")) setValue("stats");
    else if (path.includes("leaderboard")) setValue("leaderboard");
    else if (path.includes("history")) setValue("history");
    else setValue("home");
  }, []);

  const handleChange = (_, newValue) => {
    if (["home", "leaderboard"].includes(newValue)) {
      setSnackbarOpen(true); // 🔔 Mostrar aviso
      return;
    }

    if (newValue === "menu") {
      setMenuOpen(true);
    } else {
      setValue(newValue);
      navigate(newValue === "home" ? "/" : `/${newValue}`);
    }
  };

  return (
    <>
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "#1c1c1e",
          borderTop: "1px solid #333",
          boxShadow: "0 -2px 6px rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
          zIndex: 99,
        }}
        elevation={8}
      >
        <BottomNavigation
          value={value}
          onChange={handleChange}
          showLabels={false}
          sx={{
            bgcolor: "transparent",
            height: "50px",
            px: 1,
            paddingBottom: "20px",
          }}
        >
          <BottomNavigationAction value="home" icon={<Home size={20} />} sx={navItemStyle(value === "home")} />
          <BottomNavigationAction value="leaderboard" icon={<Trophy size={20} />} sx={navItemStyle(value === "leaderboard")} />
          <BottomNavigationAction value="stats" icon={<Goal size={20} />} sx={navItemStyle(value === "stats")} />
          <BottomNavigationAction value="history" icon={<Archive size={20} />} sx={navItemStyle(value === "history")} />
          <BottomNavigationAction value="menu" icon={<Menu size={20} />} sx={navItemStyle(false)} />
        </BottomNavigation>
      </Paper>

      <MenuSidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={user}
        isAdmin={user?.isAdmin}
        onAdminMode={onAdminMode}
        onChangeUser={onChangeUser}
        onLogout={onLogout}
      />

      <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert severity="info" sx={{ width: '100%' }}>
          🚧 Sección disponible pronto
        </Alert>
      </Snackbar>
    </>
  );
}

function navItemStyle(selected) {
  return {
    color: selected ? "white" : "#999",
    transition: "all 0.3s ease",
    borderRadius: "8px",
    mx: .05,
    position: "relative",
    "&::after": {
      content: '""',
      display: "block",
      width: "20%",
      height: "3px",
      borderRadius: "2px",
      backgroundColor: selected ? "white" : "transparent",
      margin: "4px auto 0 auto",
      transition: "all 0.3s ease",
    },
    "&:hover": {
      transform: "translateY(-2px)",
      backgroundColor: "transparent",
    },
  };
}
