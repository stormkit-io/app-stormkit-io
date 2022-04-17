import { useEffect, useState } from "react";
import Api from "~/utils/api/Api";

interface Stats {
  remainingDeploymentsThisMonth: number;
  numberOfDeploymentsThisMonth: number;
}

interface FetchStatsProps {
  api: Api;
  app: App;
}

interface FetchStatsReturnValue {
  loading: boolean;
  stats?: Stats;
  error?: string;
}

export const useFetchStats = ({
  api,
  app,
}: FetchStatsProps): FetchStatsReturnValue => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    let isUnmounted = false;

    api
      .fetch<Stats>(`/app/${app.id}/usage`)
      .then(res => {
        if (!isUnmounted) {
          setStats(res);
        }
      })
      .catch(() => {
        if (!isUnmounted) {
          setError("Something went wrong while fetching usage data.");
        }
      })
      .finally(() => {
        if (!isUnmounted) {
          setLoading(false);
        }
      });

    return () => {
      isUnmounted = true;
    };
  }, []);

  return { loading, error, stats };
};
