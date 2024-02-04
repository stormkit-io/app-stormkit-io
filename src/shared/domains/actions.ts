import { useState, useEffect } from "react";
import api from "~/utils/api/Api";

interface FetchDomainsProps {
  appId: string;
  envId: string;
  refreshToken?: number;
}

export const useFetchDomains = ({
  appId,
  envId,
  refreshToken,
}: FetchDomainsProps) => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .fetch<{ domains: Domain[] }>(`/domains?appId=${appId}&envId=${envId}`)
      .then(({ domains }) => {
        setDomains(domains);
      })
      .catch(() => {
        setError("Something went wrong while fetching domains.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [appId, envId, refreshToken]);

  return { domains, error, loading };
};
