import { useEffect, useState } from "react";
import api from "~/utils/api/Api";
export { useFetchDomains } from "~/shared/domains/actions";

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
