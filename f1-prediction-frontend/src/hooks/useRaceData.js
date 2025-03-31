import { useState, useEffect } from "react";
import API_URL from "../config";

export default function useRaceData(season) {
  const [races, setRaces] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [lastRace, setLastRace] = useState(null);
  const [nextRace, setNextRace] = useState(null);

  useEffect(() => {
    if (!season) return;

    fetch(`${API_URL}/get_all_races/${season}`)
      .then((res) => res.json())
      .then((data) => {
        const allRaces = data.races || [];
        setRaces(allRaces);

        const today = new Date();

        const pastRaces = allRaces.filter(r => new Date(r.date + "T12:00:00") <= today);
        const futureRaces = allRaces.filter(r => new Date(r.date + "T12:00:00") > today);

        const last = pastRaces.at(-1);
        const next = futureRaces[0];

        if (last) {
          fetch(`${API_URL}/get_race_info/${season}/${last.round}`)
            .then((r) => r.json())
            .then((details) => setLastRace({
              season,
              ...last,
              results: details.results,
              has_official_results: details.has_official_results
            }));
        } else {
          setLastRace(null);
        }

        if (next) {
          fetch(`${API_URL}/get_race_info/${season}/${next.round}`)
            .then((r) => r.json())
            .then((details) => setNextRace({
              season,
              ...next,
              results: details.results,
              has_official_results: details.has_official_results
            }));
        } else {
          setNextRace(null);
        }
      });

    fetch(`${API_URL}/get_drivers/${season}`)
      .then((res) => res.json())
      .then((data) => setDrivers(data.drivers || []));

    fetch(`${API_URL}/leaderboard`)
      .then((res) => res.json())
      .then((data) => setLeaderboard(data));

  }, [season]);

  return { races, drivers, leaderboard, lastRace, nextRace };
}
