import React, { useState } from "react";
import cn from "classnames";
import Button from "@mui/lab/LoadingButton";
import Form from "~/components/FormV2";
import Link from "~/components/Link";
import InfoBox from "~/components/InfoBoxV2";
import CopyBox from "~/components/CopyBox";
import api from "~/utils/api/Api";
import { updateDeployTrigger, deleteTrigger } from "../actions";
import type { AppSettings } from "../types.d";

interface Props {
  additionalSettings: AppSettings;
  app: App;
  environments: Array<Environment>;
  setAdditionalSettings: (value: React.SetStateAction<AppSettings>) => void;
}

const FormTriggerDeploys: React.FC<Props> = ({
  app,
  environments,
  additionalSettings,
  setAdditionalSettings,
}): React.ReactElement => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <>
      <Form
        handleSubmit={updateDeployTrigger({
          app,
          setLoading,
          setError,
        })}
      >
        {!additionalSettings.deployTrigger ? (
          <InfoBox className="mx-4">
            <p>
              Click the Generate button to create an endpoint to trigger
              deployments.{" "}
              <Link
                to="https://www.stormkit.io/docs/deployments#trigger"
                secondary
              >
                Learn more
              </Link>
              .
            </p>
          </InfoBox>
        ) : (
          environments.map((env, i) => (
            <Form.WithLabel
              key={env.id}
              label={env.env}
              className={cn("pb-0", { "pt-0": i === 0 })}
              tooltip={
                <p>
                  A <b>POST</b> or <b>GET</b> request to this endpoint will
                  trigger a deployment.
                  <Link
                    to="https://www.stormkit.io/docs/deployments#trigger"
                    secondary
                  >
                    Learn more
                  </Link>{" "}
                </p>
              }
            >
              {
                <CopyBox
                  value={`${api.url}/hooks/app/${app.id}/deploy/${additionalSettings.deployTrigger}/${env.id}`}
                />
              }
            </Form.WithLabel>
          ))
        )}
        <div className="flex justify-end p-4">
          {additionalSettings.deployTrigger && (
            <Button
              color="secondary"
              variant="contained"
              sx={{ mr: 2 }}
              loading={loading}
              onClick={e => {
                e.preventDefault();
                setLoading(true);
                setAdditionalSettings({
                  ...additionalSettings,
                  deployTrigger: undefined,
                });
                deleteTrigger(app.id)
                  .then(() => {
                    setLoading(false);
                  })
                  .catch(e => {
                    setError(e.message);
                    setLoading(false);
                  });
              }}
            >
              Delete endpoints
            </Button>
          )}
          <Button
            loading={loading}
            type="submit"
            color="secondary"
            variant="contained"
          >
            {additionalSettings.deployTrigger
              ? "Generate a new endpoint"
              : "Generate"}
          </Button>
        </div>
        {error && <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>}
      </Form>
    </>
  );
};

export default FormTriggerDeploys;
