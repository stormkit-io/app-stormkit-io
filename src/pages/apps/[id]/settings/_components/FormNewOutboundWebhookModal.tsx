import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
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
  const history = useHistory();
  const [selectedEnv, setSelectedEnv] = useState<Environment>();
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
          inputProps={{
            "aria-label": "Request URL",
          }}
          fullWidth
        />
        <Form.Select
          name="requestMethod"
          className="mb-4"
          label="Request Method"
          fullWidth
          required
        >
          <Form.Option value={"GET"}>GET</Form.Option>
          <Form.Option value={"POST"}>POST</Form.Option>
          <Form.Option value={"HEAD"}>HEAD</Form.Option>
        </Form.Select>
        <Form.Select
          name="triggerWhen"
          className="mb-6"
          label="Trigger when"
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
