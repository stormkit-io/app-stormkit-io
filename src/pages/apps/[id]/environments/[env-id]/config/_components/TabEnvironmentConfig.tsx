import React from "react";
import EnvironmentForm from "./EnvironmentForm";
import { editEnvironment } from "../actions";

interface Props {
  app: App;
  environment: Environment;
  setRefreshToken: (val: number) => void;
}

const EnvironmentEditForm: React.FC<Props> = ({
  app,
  environment,
  setRefreshToken,
}) => {
  return (
    <EnvironmentForm
      environment={environment}
      app={app}
      setRefreshToken={setRefreshToken}
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

export default EnvironmentEditForm;
