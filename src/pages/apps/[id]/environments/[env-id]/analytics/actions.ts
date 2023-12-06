import { useEffect, useState } from "react";
import api from "~/utils/api/Api";

interface FetchUniqueVisitorsProps {
  envId: string;
  refreshToken?: number;
  unique?: "true" | "false";
  ts?: "24h" | "7d" | "30d";
}

interface ChartData {
  name: string;
  total: number;
  unique: number;
}

export const useFetchVisitors = ({
  envId,
  refreshToken,
  unique = "false",
  ts = "24h",
}: FetchUniqueVisitorsProps) => {
  const [visitors, setVisitors] = useState<ChartData[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // setLoading(true) is not called here because we want to display the spinner only the first time.
    setError("");

    api
      .fetch<Record<string, { total: number; unique: number }>>(
        `/analytics/visitors?unique=${unique}&envId=${envId}&ts=${ts}`
      )
      .then(data => {
        const chartData: ChartData[] = [];

        if (ts === "24h") {
          Object.keys(data).forEach(name => {
            chartData.push({
              name,
              total: data[name]?.total || 0,
              unique: data[name]?.unique || 0,
            });
          });
        } else {
          const date = new Date();
          const span = Number(ts.replace("d", ""));
          date.setDate(date.getDate() - span); // Go back 7 or 30 days

          for (let i = 0; i < span; i++) {
            // increment 1 by 1 until today
            date.setDate(date.getDate() + 1);
            const name = date.toISOString().split("T")[0];
            chartData.push({
              name,
              total: data[name]?.total || 0,
              unique: data[name]?.unique || 0,
            });
          }
        }

        setVisitors(chartData);
      })
      .catch(() => {
        setError("Something went wrong while fetching unique visitors.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refreshToken, ts, unique]);

  return { visitors, error, loading };
};
