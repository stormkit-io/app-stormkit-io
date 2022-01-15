import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Api from "~/utils/api/Api";
import Modal from "~/components/Modal";
import { timeout as animationTimeout } from "~/components/Modal/constants";
import InfoBox from "~/components/InfoBox";
import Form from "~/components/Form";
import Link from "~/components/Link";
import Button from "~/components/Button";
import { upsertOutboundWebhook } from "../_actions/outbound_webhook_actions";
import type { FormValues } from "../_actions/outbound_webhook_actions";
import { OutboundWebhook } from "../types";

interface Props {
  api: Api;
  app: App;
  isOpen: boolean;
  toggleModal: (val: boolean) => void;
  webhook?: OutboundWebhook;
}

const headersToString = (headers?: Record<string, string>) => {
  return Object.keys(headers || {})
    .map(name => `${name}: ${headers?.[name]}`)
    .join("\n");
};

const FormNewOutboundWebhookModal: React.FC<Props> = ({
  isOpen,
  toggleModal,
  api,
  app,
  webhook,
}): React.ReactElement => {
  const history = useHistory();

  const [trigger, setTrigger] = useState("on_deploy");
  const [method, setMethod] = useState("GET");
  const [payload, setPayload] = useState("");
  const [headers, setHeaders] = useState("");

  const [showHeaders, setShowHeaders] = useState(false);
  const [showPayload, setShowPayload] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let unmounted = false;

    if (isOpen === false) {
      setTimeout(() => {
        if (unmounted === false) {
          setError(null);
          setShowPayload(false);
          setShowHeaders(false);
          setMethod("GET");
          setTrigger("on_deploy");
        }
      }, animationTimeout);
    }

    return () => {
      unmounted = true;
    };
  }, [isOpen]);

  useEffect(() => {
    if (webhook) {
      setMethod(webhook.requestMethod);
      setTrigger(webhook.triggerWhen);
      setPayload(webhook.requestPayload || "");
      setHeaders(headersToString(webhook?.requestHeaders));
    }
  }, [webhook]);

  useEffect(() => {
    setShowPayload(method === "POST");
  }, [method]);

  useEffect(() => {
    setShowHeaders(Boolean(headers));
  }, [headers]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        toggleModal(false);
      }}
      className="max-w-screen-sm"
    >
      <h3 className="mb-2 text-xl font-bold">
        {webhook ? "Update" : "Create"} outbound webhook
      </h3>
      <h4 className="mb-8 text-xs text-gray-50">
        Check out the{" "}
        <Link
          to="https://www.stormkit.io/docs/deployments/outbound-webhooks"
          secondary
        >
          documentation
        </Link>{" "}
        for examples
      </h4>
      <Form
        handleSubmit={(hooks: FormValues) => {
          setLoading(true);
          setError(null);

          upsertOutboundWebhook({
            api,
            app,
          })(hooks)
            .then(() => {
              setError(null);
              toggleModal(false);
              history.replace({
                state: {
                  outboundWebhooksRefresh: Date.now(),
                },
              });
            })
            .catch(e => {
              if (e.status === 400) {
                setError("Please make sure to provide a valid URL.");
              } else {
                setError(
                  "Something went wrong while creating new webhook. Please contact us or try again later."
                );
              }
            })
            .finally(() => {
              setLoading(false);
            });
        }}
      >
        <Form.Input type={"hidden"} defaultValue={webhook?.id} name="id" />
        <Form.Input
          name="requestUrl"
          className="bg-gray-90 mb-4"
          label="Request URL"
          placeholder="https://example.org/webhooks"
          defaultValue={webhook?.requestUrl}
          InputLabelProps={{ shrink: true }}
          inputProps={{
            "aria-label": "Request URL",
          }}
          fullWidth
        />
        <div className="mb-4">
          <Form.Switch
            withWrapper
            checked={showHeaders}
            onChange={e => setShowHeaders(e.target.checked)}
            inputProps={{
              "aria-label": "Show request headers input",
            }}
          >
            Enable request headers
          </Form.Switch>
        </div>
        {showHeaders && (
          <Form.Input
            name="requestHeaders"
            className="bg-gray-90 mb-4"
            label="Request Headers"
            defaultValue={headers}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              "aria-label": "Request headers",
            }}
            placeholder={
              "Content-Type: application/json\nAuthorization: Bearer"
            }
            maxRows={4}
            minRows={4}
            multiline
            fullWidth
          />
        )}
        <Form.Select
          name="requestMethod"
          className="mb-4"
          label="Request method"
          value={method}
          onChange={e => {
            const value = e.target.value as "GET" | "POST" | "HEAD";

            if (["GET", "POST", "HEAD"].indexOf(value) > -1) {
              setShowPayload(value === "POST");
              setMethod(value);
            }
          }}
          shrink
          fullWidth
          required
        >
          <Form.Option value={"GET"}>Get</Form.Option>
          <Form.Option value={"POST"}>Post</Form.Option>
          <Form.Option value={"HEAD"}>Head</Form.Option>
        </Form.Select>
        {showPayload && (
          <div className="mb-4">
            <Form.Input
              name="requestPayload"
              className="bg-gray-90"
              label="Request Payload"
              defaultValue={payload}
              InputLabelProps={{ shrink: true }}
              placeholder={`{ "hello": "world" }`}
              inputProps={{
                "aria-label": "Request payload",
              }}
              maxRows={4}
              minRows={4}
              multiline
              fullWidth
            />
          </div>
        )}
        <Form.Select
          name="triggerWhen"
          label="Trigger this webhook"
          value={trigger}
          onChange={e => {
            if (typeof e.target.value === "string") {
              setTrigger(e.target.value);
            }
          }}
          className="mb-6"
          shrink
          fullWidth
          required
        >
          <Form.Option value={"on_deploy"}>
            After each successful deployment
          </Form.Option>
          <Form.Option value={"on_publish"}>
            After deployment is published
          </Form.Option>
        </Form.Select>

        {error && (
          <InfoBox type={InfoBox.ERROR} className="mt-4">
            {error}
          </InfoBox>
        )}
        <div className="flex justify-center mt-4 w-full">
          <Button primary loading={loading}>
            {webhook ? "Update" : "Create"} outbound webhook
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default FormNewOutboundWebhookModal;
