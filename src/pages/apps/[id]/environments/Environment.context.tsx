import React, { createContext, useContext } from "react";
import { useRouteMatch } from "react-router-dom";
import Error404 from "~/components/Errors/Error404";
import { AppContext } from "../../App.context";

export interface EnvironmentContextProps {
  environment: Environment;
}

interface MatchParams {
  envId: string;
}

export const EnvironmentContext = createContext<EnvironmentContextProps>({
  environment: {} as Environment,
});

const Provider: React.FC = ({ children }) => {
  const match = useRouteMatch<MatchParams>();
  const { environments } = useContext(AppContext);

  const environment = environments?.filter(
    e => e.id === match.params.envId
  )?.[0];

  if (!environment) {
    return <Error404 />;
  }

  return (
    <EnvironmentContext.Provider value={{ environment }}>
      {children}
    </EnvironmentContext.Provider>
  );
};

export default Provider;
