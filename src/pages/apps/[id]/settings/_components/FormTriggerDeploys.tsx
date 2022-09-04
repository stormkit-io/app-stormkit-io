import React, { useState } from "react";
import Form from "~/components/Form";
import Link from "~/components/Link";
import InfoBox from "~/components/InfoBox";
import CopyBox from "~/components/CopyBox";
import Button from "~/components/Button";
import api from "~/utils/api/Api";
import { updateDeployTrigger } from "../actions";
import type { AppSettings } from "../types.d";

interface Props {
  additionalSettings: AppSettings;
  app: App;
  environments: Array<Environment>;
}

const LearnMore: React.FC = (): React.ReactElement => (
  <>
    <Link to="https://www.stormkit.io/docs/deployments#trigger" secondary>
      Learn more
    </Link>{" "}
    about triggering deployments.
  </>
);

const FormTriggerDeploys: React.FC<Props> = ({
  app,
  environments,
  additionalSettings,
}): React.ReactElement => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <Form
      handleSubmit={updateDeployTrigger({
        app,
        setLoading,
        setError,
      })}
    >
      <Form.Section
        label="Trigger Deploys"
        marginBottom="mb-4"
        paddingTop="pt-0"
      >
        {!additionalSettings.deployTrigger ? (
          <InfoBox>
            <p>
              Click the Generate button to create an endpoint to trigger
              deployments. <br />
              <LearnMore />
            </p>
          </InfoBox>
        ) : (
          <>
            {environments.map(env => (
              <React.Fragment key={env.id}>
                <p className="mb-4">
                  <b>{env.env}</b>
                </p>
                <div className="flex p-4 rounded bg-gray-85 mb-4">
                  <CopyBox
                    value={`${api.url}/hooks/app/${app.id}/deploy/${additionalSettings.deployTrigger}/${env.id}`}
                  />
                </div>
              </React.Fragment>
            ))}
            <Form.Description className="pt-0">
              A <b>POST</b> or <b>GET</b> request to this endpoint will trigger
              a deployment. <LearnMore />
            </Form.Description>
          </>
        )}
      </Form.Section>
      <div className="flex justify-end">
        <Button primary loading={loading} type="submit">
          {additionalSettings.deployTrigger
            ? "Generate a new endpoint"
            : "Generate"}
        </Button>
      </div>
      {error && <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>}
    </Form>
  );
};

export default FormTriggerDeploys;
