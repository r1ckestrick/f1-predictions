// Función que valida qué bonos se activan
export const checkBonuses = (player, raceResults) => {
    if (!player || !raceResults) return {
      bullseye: false,
      hatTrick: false,
      udimpo: false,
      podium: false,
      omen: false
    };
  
    const correctPicks = Object.keys(raceResults).filter(
      (key) => raceResults[key] === player[key]
    );
  
    const correctPodium = ["p1", "p2", "p3"].every(pos =>
      player[pos] && Object.values(raceResults).includes(player[pos])
    );
  
    const correctPodiumOrder = ["p1", "p2", "p3"].every(pos =>
      raceResults[pos] === player[pos]
    );
  
    return {
      bullseye: correctPicks.length >= 1,
      hatTrick: correctPodiumOrder,
      udimpo: correctPodium,
      podium: correctPicks.length > 4,
      omen: correctPicks.length === 10,
    };
  };
  
  // Función visual de cálculo de puntos (para mostrar en frontend)
  export const calculatePoints = (player, raceResults) => {
    if (!player || !raceResults) return 0;
  
    const correctPicks = Object.keys(raceResults).filter(
      (key) => raceResults[key] === player[key]
    ).length;
  
    const bonuses = checkBonuses(player, raceResults);
    const basePoints = correctPicks * 40;
  
    // Sumamos 50 puntos por cada bono activo (menos omen)
    const bonusCount = Object.entries(bonuses).filter(([key, val]) => key !== "omen" && val).length;
    const bonusPoints = bonusCount * 50;
  
    // Multiplicador por número de bonos activos
    let multiplier = 1;
    if (bonusCount === 2) multiplier = 1.1;
    if (bonusCount === 3) multiplier = 1.2;
    if (bonusCount === 4) multiplier = 1.3;
  
    // Bono adicional por OMEN
    const omenBonus = bonuses.omen ? 200 : 0;
  
    return Math.round((basePoints + bonusPoints) * multiplier + omenBonus);
  };
  