import { useEffect, useState } from "react";
import Api from "~/utils/api/Api";

export const useFetchTeams = () => {
  const [teams, setTeams] = useState<Team[]>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError("");

    Api.fetch<Team[]>("/teams")
      .then(teams => {
        setTeams(teams);
      })
      .catch(() => {
        setError("Something went wrong while fetching teams.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { teams, error, loading };
};
