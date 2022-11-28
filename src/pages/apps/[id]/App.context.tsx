import React, { createContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBox";
import Link from "~/components/Link";
import Error404 from "~/components/Errors/Error404";
import { useFetchFeatureFlags } from "~/pages/apps/[id]/environments/[env-id]/feature-flags/actions";
import { useFetchApp } from "./actions";
import { useFetchEnvironments } from "./environments/actions";

export interface AppContextProps {
  app: App;
  environments: Array<Environment>;
  setRefreshToken: (val: number) => void;
}

export const AppContext = createContext<AppContextProps>({
  app: {} as App,
  environments: [],
  setRefreshToken: () => {},
});

interface Props {
  children: React.ReactNode;
}

const AppProvider: React.FC<Props> = ({ children }) => {
  const appId = useParams().id;
  const { app, error, loading, setRefreshToken, setApp } = useFetchApp({
    appId,
  });

  const envs = useFetchEnvironments({ app });

  const { flags } = useFetchFeatureFlags({
    appId: app?.id,
    environmentId: envs.environments?.find(e => e.name === "production")?.id!,
  });

  // Bind feature flags to app object
  useEffect(() => {
    if (!app?.id) {
      return;
    }

    setApp({
      ...app,
      featureFlags: flags?.reduce((obj: Record<string, boolean>, curr) => {
        obj[curr.flagName] = curr.flagValue;
        return obj;
      }, {}),
    });
  }, [app?.id, envs.environments, flags]);

  if (loading) {
    return <Spinner primary pageCenter />;
  }

  if (error || envs.error) {
    return (
      <InfoBox type={InfoBox.ERROR}>
        {error ||
          "Something went wrong on our side. Please try again. If the problem persists reach us out through Discord or email."}
      </InfoBox>
    );
  }

  if (!app) {
    return (
      <Error404>
        <p>
          O-oh, we couldn't find this app. Would you like to go back to
          <br />
          <Link to="/" secondary>
            My Apps
          </Link>
          ?
        </p>
      </Error404>
    );
  }

  return (
    <AppContext.Provider
      value={{
        app,
        environments: envs.environments,
        setRefreshToken,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
