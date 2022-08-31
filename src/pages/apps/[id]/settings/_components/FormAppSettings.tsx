import React, { useState, useEffect } from "react";
import { Location } from "history";
import { useHistory, useLocation } from "react-router";
import Form from "~/components/Form";
import InfoBox from "~/components/InfoBox";
import Button from "~/components/Button";
import { updateAdditionalSettings } from "../actions";
import { toRepoAddr } from "../helpers";
import type { Runtime, AppSettings } from "../types.d";

const NodeJS16 = "nodejs16.x";
const NodeJS14 = "nodejs14.x";
const NodeJS12 = "nodejs12.x";

interface Props {
  app: App;
  additionalSettings: AppSettings;
}

interface LocationState extends Location {
  settingsSuccess: null | boolean;
  app: null | number;
}

const FormAppSettings: React.FC<Props> = ({ app, additionalSettings }) => {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [runtime, setRuntime] = useState<Runtime>(additionalSettings.runtime);
  const successMessage = location?.state?.settingsSuccess;

  useEffect(() => {
    if (additionalSettings.runtime) {
      setRuntime(additionalSettings.runtime);
    }
  }, [additionalSettings.runtime]);

  return (
    <Form
      handleSubmit={updateAdditionalSettings({
        app,
        setLoading,
        setError,
        history,
      })}
    >
      <Form.Section label="Display name">
        <Form.Input
          name="displayName"
          className="bg-gray-90"
          required
          defaultValue={app.displayName}
          fullWidth
          inputProps={{
            "aria-label": "Display name",
          }}
        />
        <Form.Description>
          The display name has to be unique over the whole Stormkit application
          ecosystem. It will be used as a prefix for your deployment endpoints.
          You can change it as many times as you wish, however be aware that as
          soon as your display name is changed, the old one will be available
          for others to use.
        </Form.Description>
      </Form.Section>
      <Form.Section label="Repository">
        <Form.Input
          name="repo"
          className="bg-gray-90"
          required
          defaultValue={toRepoAddr(app.repo)}
          fullWidth
          inputProps={{
            "aria-label": "Repository",
          }}
        />
        <Form.Description>
          The repository address of your application. You can paste the full
          https address here, we'll take care of formatting it for Stormkit.
        </Form.Description>
      </Form.Section>
      <Form.Section label="Runtime">
        <Form.Select
          name="runtime"
          displayEmpty
          value={runtime}
          onChange={e => setRuntime(e.target.value as Runtime)}
          inputProps={{
            "aria-label": "Runtime",
          }}
        >
          <Form.Option value={NodeJS12}>NodeJS 12.x</Form.Option>
          <Form.Option value={NodeJS14}>NodeJS 14.x</Form.Option>
          <Form.Option value={NodeJS16}>NodeJS 16.x</Form.Option>
        </Form.Select>
        <Form.Description>
          The application runtime for deployments and server side environment.
        </Form.Description>
        {runtime !== additionalSettings.runtime &&
          typeof additionalSettings.runtime !== "undefined" && (
            <InfoBox className="mt-4">
              This change will only be applied to your new deployments.
            </InfoBox>
          )}
      </Form.Section>
      <div className="flex justify-end">
        <Button primary loading={loading} type="submit">
          Update
        </Button>
      </div>
      {error && (
        <InfoBox type={InfoBox.ERROR} className="mt-4">
          {error}
        </InfoBox>
      )}
      {successMessage && (
        <InfoBox
          type={InfoBox.SUCCESS}
          toaster
          dismissable
          onDismissed={() =>
            history.replace({
              state: { app: location?.state?.app, settingsSuccess: null },
            })
          }
        >
          {successMessage}
        </InfoBox>
      )}
    </Form>
  );
};

export default FormAppSettings;
