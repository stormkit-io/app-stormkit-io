import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { toArray } from "~/utils/helpers/array";
import Modal from "~/components/Modal";
import { timeout as animationTimeout } from "~/components/Modal/constants";
import InfoBox from "~/components/InfoBox";
import Form from "~/components/Form";
import Link from "~/components/Link";
import Button from "~/components/Button";
import { upsertOutboundWebhook } from "../_actions/outbound_webhook_actions";
import type * as types from "../types";

const generateRequestHeadersObject = (
  hooks: types.OutboundWebhookFormValues
): Record<string, string> => {
  const headerKeys = toArray<string>(hooks.headerName);
  const headerValues = toArray<string>(hooks.headerValue);

  return headerKeys.reduce((prev: Record<string, string>, current, index) => {
    prev[current?.trim()] = headerValues[index]?.trim();
    return prev;
  }, {});
};

interface Props {
  app: App;
  isOpen: boolean;
  toggleModal: (val: boolean) => void;
  webhook?: types.OutboundWebhook;
}

const FormNewOutboundWebhookModal: React.FC<Props> = ({
  isOpen,
  toggleModal,
  app,
  webhook,
}): React.ReactElement => {
  const history = useHistory();

  const [trigger, setTrigger] = useState("on_deploy");
  const [method, setMethod] = useState("GET");
  const [payload, setPayload] = useState("");
  const [headers, setHeaders] = useState<
    Array<types.OutboundWebhookFormHeader>
  >([]);

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
          setHeaders([]);
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
      setHeaders(
        Object.keys(webhook?.requestHeaders || {}).map(key => ({
          key,
          value: webhook?.requestHeaders?.[key] || "",
        }))
      );
    }
  }, [webhook]);

  useEffect(() => {
    setShowPayload(method === "POST");
  }, [method]);

  useEffect(() => {
    setShowHeaders(Boolean(headers?.length));
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
        handleSubmit={(hooks: types.OutboundWebhookFormValues) => {
          setLoading(true);
          setError(null);

          upsertOutboundWebhook({
            app,
          })({
            ...hooks,
            requestHeaders: generateRequestHeadersObject(hooks),
          })
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
          <div className="mb-4">
            <Form.KeyValue
              keyProps={{
                name: "headerName",
                label: "Header name",
                placeholder: "Content-Type",
                inputProps: {
                  "aria-label": "Header name",
                },
                InputLabelProps: { shrink: true },
              }}
              valueProps={{
                name: "headerValue",
                label: "Header value",
                placeholder: "application/json; charset=utf8",
                inputProps: {
                  "aria-label": "Header value",
                },
                InputLabelProps: { shrink: true },
              }}
              defaultValues={headers}
              onChange={headers => {
                setHeaders(headers);
              }}
            />
          </div>
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
