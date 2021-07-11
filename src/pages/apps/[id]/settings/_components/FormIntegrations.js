import React, { useState } from "react";
import PropTypes from "prop-types";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Form from "~/components/Form";
import Link from "~/components/Link";
import InfoBox from "~/components/InfoBox";
import Button from "~/components/Button";
import slackPng from "../_assets/slack.png";
import { updateHooks } from "../actions";
import { formattedSlackChannelName } from "../helpers";

const FormIntegrations = ({
  api,
  app,
  additionalSettings: settings,
  history,
  location,
}) => {
  const slackHookOnStart = settings.hooks?.slack?.onStart || false;
  const slackHookOnEnd = settings.hooks?.slack?.onEnd || false;
  const slackHookOnPublish = settings.hooks?.slack?.onPublish || false;
  const successMessage = location?.state?.integrationsSuccess;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [onStart, setOnStart] = useState(slackHookOnStart);
  const [onEnd, setOnEnd] = useState(slackHookOnEnd);
  const [onPublish, setOnPublish] = useState(slackHookOnPublish);

  return (
    <Form
      handleSubmit={updateHooks({
        app,
        api,
        setLoading,
        setError,
        history,
      })}
    >
      <Form.Section
        label={
          <div className="flex items-center">
            <img className="w-6 h-6 d-inline-block mr-2" src={slackPng} /> Slack
            Hooks
          </div>
        }
        marginBottom="mb-4"
      >
        <Form.Input
          name="slack.webhook"
          className="bg-gray-90"
          placeholder="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
          defaultValue={settings.hooks?.slack?.webhook}
          inputProps={{
            "aria-label": "Webhook URL",
          }}
          required
          fullWidth
        />
        <Form.Description>
          Specify the hook URL which is obtained from Slack.{" "}
          <Link to="https://api.slack.com/messaging/webhooks" secondary>
            Learn more
          </Link>{" "}
          about Slack Integration.
        </Form.Description>
        <Form.Input
          name="slack.channel"
          className="bg-gray-90"
          placeholder="#general"
          defaultValue={formattedSlackChannelName(
            settings.hooks?.slack?.channel
          )}
          inputProps={{
            "aria-label": "Channel name",
          }}
          required
          fullWidth
        />
        <Form.Description>Specify the channel name.</Form.Description>
        <div>
          Trigger when:{" "}
          <FormControlLabel
            className="ml-2"
            label="Deploy started"
            control={
              <Form.Checkbox
                name="slack.onStart"
                value
                checked={onStart}
                onChange={e => {
                  setOnStart(e.target.checked);
                }}
              />
            }
          />
          <FormControlLabel
            className="ml-2"
            label="Deploy ended"
            control={
              <Form.Checkbox
                name="slack.onEnd"
                value
                checked={onEnd}
                onChange={e => {
                  setOnEnd(e.target.checked);
                }}
              />
            }
          />
          <FormControlLabel
            className="ml-2"
            label="Deploy published"
            control={
              <Form.Checkbox
                name="slack.onPublish"
                value
                checked={onPublish}
                onChange={e => {
                  setOnPublish(e.target.checked);
                }}
              />
            }
          />
        </div>
      </Form.Section>
      <div className="flex justify-end">
        <Button primary loading={loading} type="submit">
          Update hooks
        </Button>
      </div>
      {error && (
        <InfoBox type={InfoBox.ERROR} toaster dismissable>
          {error}
        </InfoBox>
      )}
      {successMessage && (
        <InfoBox
          type={InfoBox.SUCCESS}
          toaster
          dismissable
          onDismissed={() =>
            history.push({
              state: { app: location?.state?.app, integrationsSuccess: null },
            })
          }
        >
          {successMessage}
        </InfoBox>
      )}
    </Form>
  );
};

FormIntegrations.propTypes = {
  app: PropTypes.object,
  api: PropTypes.object,
  environments: PropTypes.array,
  additionalSettings: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
};

export default FormIntegrations;
