import { useState, useEffect } from "react";
import api from "~/utils/api/Api";

interface FetchAppProps {
  appId?: string;
}

interface FetchAppReturnValue {
  app: App | undefined;
  loading: boolean;
  error: string | null;
  refreshToken?: number;
  setRefreshToken: (val: number) => void;
}

interface FetchAppAPIResponse {
  app: App;
}

const appCache: Record<string, App> = {};

export const useFetchApp = ({ appId }: FetchAppProps): FetchAppReturnValue => {
  const [app, setApp] = useState<App | undefined>(appCache[appId!]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [refreshToken, setRefreshToken] = useState<number>();

  useEffect(() => {
    let unmounted = false;

    if (appCache[appId!] || !appId) {
      return;
    }

    setLoading(true); // Do not refresh when updating app object.
    setError(null);

    api
      .fetch<FetchAppAPIResponse>(`/app/${appId}`)
      .then(res => {
        const app = res.app;
        const pieces = app.repo.split("/");
        const provider = pieces.shift();

        if (
          provider === "github" ||
          provider === "gitlab" ||
          provider === "bitbucket"
        ) {
          app.provider = provider;
          app.name = pieces.join("/");
        }

        if (unmounted !== true) {
          setApp(app);
        }
      })
      .catch(async res => {
        if (res.status === 404) {
          return;
        }

        try {
          const error = await res.json();

          if (unmounted !== true) {
            setApp(undefined);
            setError(error);
          }
        } catch (e) {
          if (unmounted !== true) {
            setError(
              "Something went wrong on our side. Please try again. If the problem persists reach us out through Discord or email."
            );
          }
        }
      })
      .finally(() => {
        if (unmounted !== true) {
          setLoading(false);
        }
      });

    return () => {
      unmounted = true;
    };
  }, [api, appId, refreshToken]);

  return { app, loading, error, refreshToken, setRefreshToken };
};
