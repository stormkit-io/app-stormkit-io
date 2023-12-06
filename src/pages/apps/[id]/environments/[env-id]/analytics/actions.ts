import { useEffect, useState } from "react";
import api from "~/utils/api/Api";

interface FetchUniqueVisitorsProps {
  envId: string;
  refreshToken?: number;
  unique?: "true" | "false";
  ts?: "24h" | "7d" | "30d";
}

interface VisitorsChartData {
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
  const [visitors, setVisitors] = useState<VisitorsChartData[]>([]);
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
        const VisitorsChartData: VisitorsChartData[] = [];

        if (ts === "24h") {
          Object.keys(data).forEach(name => {
            VisitorsChartData.push({
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
            VisitorsChartData.push({
              name,
              total: data[name]?.total || 0,
              unique: data[name]?.unique || 0,
            });
          }
        }

        setVisitors(VisitorsChartData);
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

interface FetchTopReferrerProps {
  envId: string;
  domainName: string;
}

interface Referrer {
  name: string;
  count: number;
}

export const useFetchTopReferrers = ({
  envId,
  domainName,
}: FetchTopReferrerProps) => {
  const [referrers, setReferrers] = useState<Referrer[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .fetch<Record<string, number>>(
        `/analytics/referrers?envId=${envId}&domainName=${domainName}`
      )
      .then(data => {
        const refs: Referrer[] = Object.keys(data).map(ref => ({
          name: ref,
          count: data[ref],
        }));

        refs.sort((a, b) =>
          a.count > b.count ? -1 : a.count === b.count ? 0 : 1
        );

        setReferrers(refs);
      })
      .catch(() => {
        setError("Something went wrong while fetching referrers.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { referrers, loading, error };
};
