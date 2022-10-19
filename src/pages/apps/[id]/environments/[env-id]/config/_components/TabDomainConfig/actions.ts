import { useEffect, useState } from "react";
import api from "~/utils/api/Api";

interface SetDomainProps {
  app: App;
  environment: Environment;
  values: { domain: string };
}

export const setDomain = ({
  app,
  environment,
  values,
}: SetDomainProps): Promise<void> => {
  return api.put("/app/env/domain", {
    appId: app.id,
    domain: values.domain.trim(),
    env: environment.env,
  });
};

interface DeleteDomainProps {
  app: App;
  environment: Environment;
  domainName: string;
}

export const deleteDomain = ({
  app,
  environment,
  domainName,
}: DeleteDomainProps): Promise<void> => {
  return api.delete("/app/env/domain", {
    appId: app.id,
    domain: domainName,
    env: environment.env,
  });
};

interface FetchDomainsInfoProps {
  app: App;
  environment: Environment;
}

export const fetchDomainsInfo = ({
  app,
  environment,
}: FetchDomainsInfoProps): Promise<Domain> => {
  return api.fetch<Domain>(`/app/${app.id}/envs/${environment.env}/lookup`);
};

interface DomainLookupProps {
  app: App;
  environment: Environment;
}

interface DomainLookupReturnValue {
  loading: boolean;
  error?: string;
  domainsInfo: Domain[];
  setDomainsInfo: (val: Domain[]) => void;
}

export const useDomainLookup = ({
  app,
  environment,
}: DomainLookupProps): DomainLookupReturnValue => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [domainsInfo, setDomainsInfo] = useState<Domain[]>([]);
  const domainName = environment.domain.name;

  useEffect(() => {
    if (!domainName) {
      setDomainsInfo([]);
      return;
    }

    setLoading(true);
    setError(undefined);

    fetchDomainsInfo({
      app,
      environment,
    })
      .then(res => {
        if (res.domainName) {
          setDomainsInfo([res]);
        }
      })
      .catch(() => {
        setError("Something went wrong file fetching domain information.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [app, environment, domainName]);

  return { loading, error, domainsInfo, setDomainsInfo };
};
