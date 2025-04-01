import { useState, useEffect } from "react";
import { PLAYERS } from "../data/players";

export default function useCurrentUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedName = localStorage.getItem("player");
    if (!savedName) return;

    // Recolectamos info completa desde PLAYERS
    const playerData = PLAYERS[savedName];
    if (!playerData) return;

    setUser({
      name: playerData.name,
      image: playerData.image,
      color: playerData.color,
      isAdmin: savedName === "Renato", // puedes mejorarlo luego
    });
  }, []);

  const login = (name) => {
    if (!PLAYERS[name]) return;
    localStorage.setItem("player", name);
    setUser({
      name: PLAYERS[name].name,
      image: PLAYERS[name].image,
      color: PLAYERS[name].color,
      isAdmin: name === "Renato",
    });
  };

  const logout = () => {
    localStorage.removeItem("player");
    setUser(null);
  };

  return { user, login, logout };
}
