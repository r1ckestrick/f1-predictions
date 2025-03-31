// ✅ src/hooks/useRaceResults.jsx
import { useEffect, useState } from "react";
import API_URL from "../config";

export default function useRaceResults(season, round) {
  const [raceResults, setRaceResults] = useState(null);
  const [hasOfficialResults, setHasOfficialResults] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!season || !round) return;

    setLoading(true);

    fetch(`${API_URL}/get_race_results/${season}/${round}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setRaceResults(data);
          setHasOfficialResults(true);
        } else {
          setRaceResults(null);
          setHasOfficialResults(false);
        }
      })
      .catch(() => {
        setRaceResults(null);
        setHasOfficialResults(false);
      })
      .finally(() => setLoading(false));

  }, [season, round]);

  return { raceResults, hasOfficialResults, loading };
}
