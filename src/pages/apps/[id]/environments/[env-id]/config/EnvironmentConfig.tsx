import React, { useContext } from "react";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import EnvironmentForm from "./EnvironmentForm";
import { editEnvironment } from "./actions";

const EnvironmentConfig: React.FC = () => {
  const { app, setRefreshToken } = useContext(AppContext);
  const { environment } = useContext(EnvironmentContext);

  return (
    <EnvironmentForm
      environment={environment}
      app={app}
      formHandler={({ values, setLoading, setError, setSuccess }) => {
        setLoading(true);
        setSuccess(false);

        editEnvironment({
          app,
          environmentId: environment.id!,
          values,
        })
          .then(() => {
            setError(undefined);
            setRefreshToken(Date.now());
            setSuccess(true);
          })
          .catch(async res => {
            if (typeof res === "string") {
              setError(res);
              return;
            }

            try {
              const jsonData = await res.json();
              setError(jsonData.error);
            } catch {
              setError(`"Error: ${(await res?.body()) || res}`);
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }}
    />
  );
};

export default EnvironmentConfig;
