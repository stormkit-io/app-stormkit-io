import React, { useState } from "react";
import PropTypes from "prop-types";
import Form from "~/components/Form";
import Link from "~/components/Link";
import InfoBox from "~/components/InfoBox";
import CopyBox from "~/components/CopyBox";
import Button from "~/components/Button";
import EnvironmentSelector from "~/components/EnvironmentSelector";
import { updateDeployTrigger } from "../actions";

const LearnMore = () => (
  <>
    <Link to="https://www.stormkit.io/docs/deployments#trigger" secondary>
      Learn more
    </Link>{" "}
    about triggering deployments.
  </>
);

const FormTriggerDeploys = ({
  api,
  app,
  environments,
  additionalSettings,
  history,
  location,
}) => {
  const successMessage = location?.state?.triggerDeploysSuccess;
  const defaultValue = environments?.[0]?.id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState(defaultValue);

  return (
    <Form
      handleSubmit={updateDeployTrigger({
        app,
        api,
        setLoading,
        setError,
        history,
      })}
    >
      <Form.Section label="Trigger Deploys" marginBottom="mb-4">
        {!additionalSettings.trigger ? (
          <InfoBox>
            <p>
              Click the Generate button to create an endpoint to trigger
              deployments. <br />
              <LearnMore />
            </p>
          </InfoBox>
        ) : (
          <>
            <EnvironmentSelector
              className="mb-4"
              defaultValue={defaultValue}
              environments={environments}
              placeholder="Choose a build configuration"
              onSelect={(e) => setSelectedEnvironment(e?.env)}
            />
            {selectedEnvironment && (
              <>
                <div className="flex p-4 rounded bg-gray-85">
                  <CopyBox
                    value={`https://api.stormkit.io/hooks/app/${app.id}/deploy/${additionalSettings.trigger}/${selectedEnvironment}`}
                  />
                </div>
                <Form.Description>
                  A <b>POST</b> or <b>GET</b> request to this endpoint will
                  trigger a deployment. <LearnMore />
                </Form.Description>
              </>
            )}
          </>
        )}
      </Form.Section>
      <div className="flex justify-end">
        <Button primary loading={loading} type="submit">
          {additionalSettings.trigger ? "Generate a new endpoint" : "Generate"}
        </Button>
      </div>
      {error && <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>}
      {successMessage && (
        <InfoBox
          type={InfoBox.SUCCESS}
          toaster
          dismissable
          onDismissed={() =>
            history.push({
              state: { app: location?.state?.app, triggerDeploysSuccess: null },
            })
          }
        >
          {successMessage}
        </InfoBox>
      )}
    </Form>
  );
};

FormTriggerDeploys.propTypes = {
  app: PropTypes.object,
  api: PropTypes.object,
  environments: PropTypes.array,
  additionalSettings: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
};

export default FormTriggerDeploys;
