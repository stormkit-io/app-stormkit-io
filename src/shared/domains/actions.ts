import { useState, useEffect } from "react";
import api from "~/utils/api/Api";

interface FetchDomainsProps {
  appId: string;
  envId: string;
  search: string;
  refreshToken?: number;
  verified?: boolean;
}

export const useFetchDomains = ({
  appId,
  envId,
  verified,
  search,
  refreshToken,
}: FetchDomainsProps) => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qs = new URLSearchParams(
      JSON.parse(
        JSON.stringify({
          verified,
          envId,
          appId,
          search: search || undefined,
        })
      )
    );

    api
      .fetch<{ domains: Domain[] }>(`/domains?${qs.toString()}`)
      .then(({ domains }) => {
        setDomains(domains);
      })
      .catch(() => {
        setError("Something went wrong while fetching domains.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [appId, envId, verified, refreshToken, search]);

  return { domains, error, loading };
};
