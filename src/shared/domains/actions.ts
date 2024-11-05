import { useState, useEffect } from "react";
import api from "~/utils/api/Api";

interface FetchDomainsProps {
  appId: string;
  envId: string;
  search: string;
  afterId?: string;
  refreshToken?: number;
  verified?: boolean;
}

export const useFetchDomains = ({
  appId,
  envId,
  verified,
  afterId,
  search,
  refreshToken,
}: FetchDomainsProps) => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>();

  useEffect(() => {
    const qs = new URLSearchParams(
      JSON.parse(
        JSON.stringify({
          verified,
          envId,
          appId,
          afterId,
          pageSize: 100,
          search: search || undefined,
        })
      )
    );

    api
      .fetch<{ domains: Domain[]; pagination: Pagination }>(
        `/domains?${qs.toString()}`
      )
      .then(({ domains: newDomains, pagination }) => {
        setDomains(afterId ? [...domains, ...newDomains] : newDomains);
        setPagination(pagination);
      })
      .catch(() => {
        setError("Something went wrong while fetching domains.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [appId, envId, verified, refreshToken, search, afterId]);

  return { domains, error, loading, pagination };
};
