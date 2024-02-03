import { useEffect, useState } from "react";
import api from "~/utils/api/Api";

interface FetchDomainsProps {
  appId: string;
  envId: string;
  refreshToken: number;
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

interface SetDomainProps {
  appId: string;
  envId: string;
  values: { domain: string };
}

export const setDomain = ({
  appId,
  envId,
  values,
}: SetDomainProps): Promise<void> => {
  return api.post("/domains", {
    appId,
    envId,
    domain: values.domain.trim(),
  });
};

interface DeleteDomainProps {
  appId: string;
  envId: string;
  domainId: string;
}

export const deleteDomain = ({
  appId,
  envId,
  domainId,
}: DeleteDomainProps): Promise<void> => {
  return api.delete(
    `/domains?appId=${appId}&domainId=${domainId}&envId=${envId}`
  );
};

interface DomainLookupProps {
  domainId: string;
  appId: string;
  envId: string;
  refreshToken: number;
}

export const useDomainLookup = ({
  domainId,
  appId,
  envId,
  refreshToken,
}: DomainLookupProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [info, setDomainsInfo] = useState<DomainLookup>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);

    api
      .fetch<DomainLookup>(
        `/domains/lookup?appId=${appId}&envId=${envId}&domainId=${domainId}`
      )
      .then(res => {
        if (res.domainName) {
          setDomainsInfo(res);
        }
      })
      .catch(() => {
        setError("Something went wrong file fetching domain information.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [appId, envId, domainId, refreshToken]);

  return { loading, error, info };
};
