import { useEffect, useState } from "react";
import { History } from "history";
import api from "~/utils/api/Api";

interface SetDomainProps {
  app: App;
  history: History;
  environment: Environment;
  setError: SetError;
  setLoading: SetLoading;
}

export const setDomain =
  ({ app, environment, history, setError, setLoading }: SetDomainProps) =>
  ({ domain }: { domain: string }): void => {
    setLoading(true);

    api
      .put("/app/env/domain", {
        appId: app.id,
        domain: domain.trim(),
        env: environment.env,
      })
      .then(() => {
        setLoading(false);
        history.replace({ state: { envs: Date.now() } });
      })
      .catch(res => {
        setLoading(false);
        setError(
          res.status === 400
            ? "Please provide a valid domain name."
            : res.status === 429
            ? "You have issued too many requests. Please wait a while before retrying."
            : "Something went wrong while setting up the domain. Make sure it is a valid domain."
        );
      });
  };

interface DeleteDomainProps {
  app: App;
  environment: Environment;
  domainName: string;
  setLoading: SetLoading;
  setError: SetError;
  history: History;
}

export const deleteDomain = ({
  app,
  environment,
  domainName,
  setLoading,
  setError,
  history,
}: DeleteDomainProps): Promise<void> => {
  setLoading(true);

  return api
    .delete("/app/env/domain", {
      appId: app.id,
      domain: domainName,
      env: environment.env,
    })
    .then(() => {
      history.replace({ state: { envs: Date.now() } });
    })
    .catch(res => {
      setLoading(false);
      setError(
        res.status === 400
          ? "Please provide a valid domain name."
          : res.status === 429
          ? "You have issued too many requests. Please wait a while before retrying."
          : "Something went wrong while setting up the domain. Make sure it is a valid domain."
      );
    });
};

interface FetchDomainsInfoProps {
  app: App;
  environment: Environment;
  setLoading: SetLoading;
  setError: SetError;
  unmounted: boolean;
  setDomainsInfo: (val: Domain[]) => void;
}

export const fetchDomainsInfo = ({
  app,
  environment,
  setLoading,
  setError,
  unmounted = false,
  setDomainsInfo,
}: FetchDomainsInfoProps): Promise<void> => {
  setLoading(true);

  return api
    .fetch<Domain>(`/app/${app.id}/envs/${environment.env}/lookup`)
    .then(res => {
      if (!unmounted) {
        setDomainsInfo([res]);
        setLoading(false);
      }
    })
    .catch(() => {
      if (!unmounted) {
        setLoading(false);
        setError(
          "Something went wrong while fetching domain information. Please try again, if the problem persists contact us from Discord or email."
        );
      }
    });
};

interface DomainLookupProps {
  app: App;
  environment: Environment;
}

interface DomainLookupReturnValue {
  loading: boolean;
  error: string | null;
  domainsInfo: Domain[];
  setDomainsInfo: (val: Domain[]) => void;
}

export const useDomainLookup = ({
  app,
  environment,
}: DomainLookupProps): DomainLookupReturnValue => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [domainsInfo, setDomainsInfo] = useState<Domain[]>([]);
  const domainName = environment.domain.name;

  useEffect(() => {
    let unmounted = false;

    if (!domainName) {
      return;
    }

    fetchDomainsInfo({
      app,
      environment,
      unmounted,
      setDomainsInfo,
      setLoading,
      setError,
    });

    return () => {
      unmounted = true;
    };
  }, [app, environment, domainName]);

  return { loading, error, domainsInfo, setDomainsInfo };
};
