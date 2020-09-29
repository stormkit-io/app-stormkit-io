import { useEffect, useState } from "react";

export const setDomain = ({
  app,
  api,
  environment,
  history,
  setError,
  setLoading,
}) => ({ domain }) => {
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
    .catch((res) => {
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

export const deleteDomain = ({
  api,
  app,
  environment,
  domainName,
  setLoading,
  setError,
  history,
}) => {
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
    .catch((res) => {
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

export const fetchDomainsInfo = ({
  api,
  app,
  environment,
  setLoading,
  setError,
  setDomainsInfo,
  withUXFix,
  unmounted = false,
}) => {
  setLoading(true);
  const timeout = withUXFix ? 1000 : 0;

  return api
    .fetch(`/app/${app.id}/envs/${environment.env}/lookup`)
    .then((res) => {
      return new Promise((resolve) => {
        // This is a UX fix. Verifying the domain needs to seem like a process
        // which takes time. It will give the user the feeling that something is happening
        // behind the scenes.
        setTimeout(() => {
          resolve();

          if (!unmounted) {
            setDomainsInfo([res]);
            setLoading(false);
          }
        }, timeout);
      });
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

export const useCertificatePoll = ({ isInUse, cert, onVerify }) => {
  useEffect(() => {
    let unmounted = false;

    // Allow a bit time to issue a certificate.
    setTimeout(() => {
      if (cert === null && isInUse && !unmounted) {
        onVerify({ setLoading: () => {}, setError: () => {} });
      }
    }, 2500);

    return () => {
      unmounted = true;
    };
  }, [cert, isInUse, onVerify]);
};

export const useDomainLookup = ({ api, app, environment }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [domainsInfo, setDomainsInfo] = useState([]);
  const domainName = environment.domain.name;

  useEffect(() => {
    let unmounted = false;

    if (!domainName) {
      return;
    }

    fetchDomainsInfo({
      api,
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
  }, [api, app, environment, domainName]);

  return { loading, error, domainsInfo, setDomainsInfo };
};
