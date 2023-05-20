import React, { useState, useEffect } from "react";
import { toArray } from "~/utils/helpers/array";
import Modal from "~/components/ModalV2";
import { timeout as animationTimeout } from "~/components/Modal/constants";
import InfoBox from "~/components/InfoBoxV2";
import Form from "~/components/FormV2";
import Link from "~/components/Link";
import Container from "~/components/Container";
import Button from "~/components/ButtonV2";
import { upsertOutboundWebhook } from "../_actions/outbound_webhook_actions";
import type * as types from "../types";

const generateRequestHeadersObject = (
  hooks: types.OutboundWebhookFormValues
): Record<string, string> => {
  const headerKeys = toArray<string>(hooks["headers[key]"]).filter(i => i);
  const headerValues = toArray<string>(hooks["headers[value]"]).filter(i => i);

  return headerKeys.reduce((prev: Record<string, string>, current, index) => {
    prev[current?.trim()] = headerValues[index]?.trim();
    return prev;
  }, {});
};

interface Props {
  app: App;
  isOpen: boolean;
  toggleModal: (val: boolean) => void;
  onUpdate: () => void;
  webhook?: types.OutboundWebhook;
}

const FormNewOutboundWebhookModal: React.FC<Props> = ({
  isOpen,
  toggleModal,
  onUpdate,
  app,
  webhook,
}): React.ReactElement => {
  const [trigger, setTrigger] = useState("on_deploy");
  const [method, setMethod] = useState("GET");
  const [payload, setPayload] = useState("");
  const [headers, setHeaders] = useState<Record<string, string>>({});
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
          setHeaders({});
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
      setHeaders(webhook?.requestHeaders || {});
    }
  }, [webhook]);

  useEffect(() => {
    setShowPayload(method === "POST");
  }, [method]);

  useEffect(() => {
    setShowHeaders(Object.keys(headers).length > 0);
  }, [headers]);

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        toggleModal(false);
      }}
      className="max-w-screen-sm"
    >
      <Container
        title={<span>{webhook ? "Update" : "Create"} outbound webhook</span>}
        subtitle={
          <span>
            Check out the{" "}
            <Link
              to="https://www.stormkit.io/docs/deployments/outbound-webhooks"
              secondary
            >
              documentation
            </Link>{" "}
            for examples
          </span>
        }
      >
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
                onUpdate();
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
          <div className="hidden">
            <Form.Input type={"hidden"} defaultValue={webhook?.id} name="id" />
          </div>
          <Form.WithLabel className="pt-0 mt-0" label="Request URL">
            <Form.Input
              name="requestUrl"
              placeholder="https://example.org/webhooks"
              defaultValue={webhook?.requestUrl}
              fullWidth
            />
          </Form.WithLabel>
          <Form.WithLabel label="Enable headers" className="pt-0">
            <Form.Switch
              color="secondary"
              checked={showHeaders}
              onChange={e => setShowHeaders(e.target.checked)}
            />
          </Form.WithLabel>
          {showHeaders && (
            <div className="mx-4" data-testid="request-headers">
              <Form.KeyValue
                inputName="headers"
                keyName="Header name"
                keyPlaceholder="Content-Type"
                valName="Header value"
                valPlaceholder="application/json"
                defaultValue={headers}
              />
            </div>
          )}
          <Form.WithLabel label="Request method" className="pt-0">
            <Form.Select
              name="requestMethod"
              value={method}
              onChange={e => {
                const value = e.target.value as "GET" | "POST" | "HEAD";

                if (["GET", "POST", "HEAD"].indexOf(value) > -1) {
                  setShowPayload(value === "POST");
                  setMethod(value);
                }
              }}
              fullWidth
              required
            >
              <Form.Option value={"GET"}>Get</Form.Option>
              <Form.Option value={"POST"}>Post</Form.Option>
              <Form.Option value={"HEAD"}>Head</Form.Option>
            </Form.Select>
          </Form.WithLabel>
          {showPayload && (
            <Form.WithLabel
              label={<span className="h-full pt-3 mt-px">Request payload</span>}
              className="pt-0"
            >
              <Form.Input
                name="requestPayload"
                defaultValue={payload}
                placeholder={`{ "hello": "world" }`}
                maxRows={4}
                minRows={4}
                multiline
                fullWidth
              />
            </Form.WithLabel>
          )}
          <Form.WithLabel label="Trigger when" className="pt-0">
            <Form.Select
              name="triggerWhen"
              value={trigger}
              onChange={e => {
                if (typeof e.target.value === "string") {
                  setTrigger(e.target.value);
                }
              }}
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
          </Form.WithLabel>

          {error && (
            <InfoBox type={InfoBox.ERROR} className="mx-4 mb-4">
              {error}
            </InfoBox>
          )}
          <div className="flex justify-center mb-4 w-full">
            <Button category="action" type="submit" loading={loading}>
              {webhook ? "Update" : "Create"} outbound webhook
            </Button>
          </div>
        </Form>
      </Container>
    </Modal>
  );
};

export default FormNewOutboundWebhookModal;
