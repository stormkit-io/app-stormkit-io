import type { Runtime, AppSettings } from "../types.d";
import type { FormValues } from "../actions";
import React, { useState, useEffect } from "react";
import Form from "~/components/FormV2";
import InfoBox from "~/components/InfoBoxV2";
import Button from "~/components/ButtonV2";
import { updateAdditionalSettings } from "../actions";
import { toRepoAddr } from "../helpers";

const NodeJS18 = "nodejs18.x";
const NodeJS16 = "nodejs16.x";
const NodeJS14 = "nodejs14.x";
const NodeJS12 = "nodejs12.x";
const Bun1 = "bun1.x";

interface Props {
  app: App;
  additionalSettings: AppSettings;
  onUpdate: () => void;
}

const FormAppSettings: React.FC<Props> = ({
  app,
  additionalSettings,
  onUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [runtime, setRuntime] = useState<Runtime>(additionalSettings.runtime);

  useEffect(() => {
    if (additionalSettings.runtime) {
      setRuntime(additionalSettings.runtime);
    }
  }, [additionalSettings.runtime]);

  return (
    <Form<FormValues>
      handleSubmit={values => {
        setLoading(true);
        setError(null);
        updateAdditionalSettings({
          app,
          values,
        })
          .then(() => {
            onUpdate();
          })
          .catch(res => {
            res
              .json()
              .then(({ errors }: { errors: Record<string, string> }) => {
                setError(
                  Object.keys(errors)
                    .map(k => errors[k])
                    .join(", ")
                );
              })
              .catch(() => {
                setError(
                  "Something went wrong happened while updating settings. " +
                    "Please try again and if the problem persists contact us from Discord or email."
                );
              });
          })
          .finally(() => {
            setLoading(false);
          });
      }}
    >
      <Form.WithLabel
        label="Display name"
        className="pb-0 pt-0"
        tooltip={
          <p>
            The display name has to be unique over the whole Stormkit
            application ecosystem. It will be used as a prefix for your
            deployment endpoints. You can change it as many times as you wish,
            however be aware that as soon as your display name is changed, the
            old one will be available for others to use.
          </p>
        }
      >
        <Form.Input
          name="displayName"
          required
          defaultValue={app.displayName}
          fullWidth
        />
      </Form.WithLabel>
      <Form.WithLabel
        label="Repository"
        className="pb-0"
        tooltip={<p>The repo address of your application.</p>}
      >
        <Form.Input
          name="repo"
          placeholder="e.g. https://github.com/stormkit-io/app-stormkit-io"
          required
          defaultValue={toRepoAddr(app.repo)}
          fullWidth
        />
      </Form.WithLabel>
      <Form.WithLabel
        label="Runtime"
        tooltip={
          <p>The application runtime for the CI and server side environment.</p>
        }
      >
        <Form.Select
          name="runtime"
          displayEmpty
          value={runtime}
          onChange={e => setRuntime(e.target.value as Runtime)}
        >
          <Form.Option value={NodeJS12} disabled>
            NodeJS 12.x
          </Form.Option>
          <Form.Option value={NodeJS14}>NodeJS 14.x</Form.Option>
          <Form.Option value={NodeJS16}>NodeJS 16.x</Form.Option>
          <Form.Option value={NodeJS18}>NodeJS 18.x</Form.Option>
          <Form.Option value={Bun1}>Bun 1.x</Form.Option>
        </Form.Select>
      </Form.WithLabel>
      {runtime !== additionalSettings.runtime &&
        typeof additionalSettings.runtime !== "undefined" && (
          <InfoBox className="mx-4 mb-4">
            This change will only be applied to your new deployments.
          </InfoBox>
        )}
      <div className="flex justify-end px-4 pb-4">
        <Button loading={loading} type="submit" category="action">
          Update
        </Button>
      </div>
      {error && (
        <InfoBox type={InfoBox.ERROR} className="mt-4">
          {error}
        </InfoBox>
      )}
    </Form>
  );
};

export default FormAppSettings;
