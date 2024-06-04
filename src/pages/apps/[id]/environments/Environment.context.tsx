import React, { createContext, useContext } from "react";
import { useParams } from "react-router-dom";
import Error404 from "~/components/Errors/Error404";
import { AppContext } from "~/pages/apps/[id]/App.context";

export interface EnvironmentContextProps {
  environment: Environment;
}

export const EnvironmentContext = createContext<EnvironmentContextProps>({
  environment: {} as Environment,
});

interface Props {
  children: React.ReactNode;
}

export default function Provider({ children }: Props) {
  const { envId } = useParams();
  const { environments } = useContext(AppContext);

  const environment = environments?.filter(e => e.id === envId)?.[0];

  if (!environment) {
    return (
      <div className="h-full flex-1 flex items-center">
        <Error404 withLogo={false}>This environment is not found.</Error404>
      </div>
    );
  }

  return (
    <EnvironmentContext.Provider value={{ environment }}>
      {children}
    </EnvironmentContext.Provider>
  );
}
