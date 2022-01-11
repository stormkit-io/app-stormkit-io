import React, { useState, useEffect } from "react";
import Api from "~/utils/api/Api";
import Modal, { ModalContextProps } from "~/components/Modal";
import InfoBox from "~/components/InfoBox";
import Form from "~/components/Form";
import Button from "~/components/Button";
import { connect } from "~/utils/context";
import { createOutboundWebhook } from "../_actions/outbound_webhook_actions";
import type { OutboundWebhooks } from "../types.d";

interface Props {
  api: Api;
  app: App;
}

const ModalContext = Modal.Context();

const FormNewOutboundWebhookModal: React.FC<Props & ModalContextProps> = ({
  isOpen,
  toggleModal,
  api,
  app,
}): React.ReactElement => {
  const [showHeaders, setShowHeaders] = useState(false);
  const [showPayload, setShowPayload] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setError(null);
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        toggleModal(false);
      }}
      className="max-w-screen-sm"
    >
      <h3 className="mb-8 text-xl font-bold">Create outbound webhook</h3>
      <Form
        handleSubmit={(hooks: OutboundWebhooks) => {
          setLoading(true);
          setError(null);

          createOutboundWebhook({
            api,
            app,
          })(hooks)
            .then(() => {
              setError(null);
              toggleModal(false);
            })
            .catch(async e => {
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
        <Form.Input
          name="requestUrl"
          className="bg-gray-90 mb-4"
          label="Request URL"
          placeholder="https://example.org/webhooks"
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
          label="Request Method"
          defaultValue="GET"
          onChange={e => {
            setShowPayload(e.target.value === "POST");
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
          defaultValue="on_deploy"
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
            Create outbound webhook
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default Object.assign(
  connect<Props, ModalContextProps>(FormNewOutboundWebhookModal, [
    { Context: ModalContext, props: ["toggleModal", "isOpen"] },
  ]),
  ModalContext
);
