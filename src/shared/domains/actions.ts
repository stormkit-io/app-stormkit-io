import { useState, useEffect } from "react";
import api from "~/utils/api/Api";

interface FetchDomainsProps {
  appId: string;
  envId: string;
  refreshToken?: number;
  verified?: boolean;
}

export const useFetchDomains = ({
  appId,
  envId,
  verified,
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
  }, [appId, envId, verified, refreshToken]);

  return { domains, error, loading };
};
