import React, { useState } from "react";
import InfoBox from "~/components/InfoBoxV2";
import Button from "~/components/ButtonV2";
import Modal from "~/components/ModalV2";
import Container from "~/components/Container";
import Spinner from "~/components/Spinner";
import DotDotDot from "~/components/DotDotDotV2";
import { truncate } from "~/utils/helpers/string";
import FormNewOutboundWebhookModal from "./FormOutboundWebhookModal";
import {
  useFetchOutboundWebhooks,
  sendSampleRequest,
  deleteOutboundWebhook,
} from "../_actions/outbound_webhook_actions";
import type { SendSampleRequestResponse } from "../_actions/outbound_webhook_actions";
import { OutboundWebhook } from "../types";

interface Props {
  app: App;
}

const FormOutboundWebhooks: React.FC<Props> = ({ app }): React.ReactElement => {
  const [loadingSample, setLoadingSample] = useState(false);
  const [webhookToEdit, setWebhookToEdit] = useState<OutboundWebhook>();
  const [sampleData, setSampleData] = useState<SendSampleRequestResponse>();
  const [isModalOpen, toggleModal] = useState(false);
  const [refreshToken, setRefreshToken] = useState<number>();
  const { hooks, error, loading } = useFetchOutboundWebhooks({
    app,
    refreshToken,
  });

  return (
    <>
      {error && (
        <InfoBox type={InfoBox.ERROR} dismissable className="mx-4 mb-4">
          {error}
        </InfoBox>
      )}
      {hooks.length ? (
        hooks.map(hook => (
          <div
            className="bg-blue-10 p-4 mx-4 mb-4 flex justify-between"
            key={hook.id}
          >
            <div>
              <p className="font-bold">{hook.requestMethod?.toUpperCase()}</p>
              <p className="text-xs mt-1">{truncate(hook.requestUrl, 50)}</p>
              <p className="text-xs mt-1">
                {hook.triggerWhen === "on_deploy"
                  ? "Triggered after each successful deployment"
                  : "Triggered after a deployment is published"}
              </p>
            </div>
            <div className="self-baseline">
              <DotDotDot
                items={[
                  {
                    text: "Edit",
                    onClick: () => {
                      setWebhookToEdit(hook);
                      toggleModal(true);
                    },
                  },
                  {
                    text: (
                      <div className="flex">
                        Trigger sample
                        {loadingSample && (
                          <Spinner
                            className="ml-2"
                            primary
                            width={4}
                            height={4}
                          />
                        )}
                      </div>
                    ),
                    onClick: close => {
                      setLoadingSample(true);

                      sendSampleRequest({ app, whId: hook.id })
                        .then(res => {
                          setLoadingSample(false);
                          setSampleData(res);
                        })
                        .finally(() => {
                          close?.();
                        });

                      return false;
                    },
                  },
                  {
                    text: "Delete",
                    onClick: close => {
                      deleteOutboundWebhook({
                        app,
                        whId: hook.id,
                      }).then(() => {
                        setRefreshToken(Date.now());
                        close?.();
                      });
                    },
                  },
                ]}
              />
            </div>
          </div>
        ))
      ) : (
        <InfoBox className="mx-4 mb-4">
          You don't have any webhooks installed.
        </InfoBox>
      )}
      <div className="flex justify-end p-4 pt-0">
        <Button
          category="action"
          type="submit"
          aria-label="Add new webhook"
          loading={loading}
          onClick={() => {
            toggleModal(true);
          }}
        >
          Add new webhook
        </Button>
      </div>
      <Modal
        open={Boolean(sampleData)}
        className="max-w-screen-sm"
        onClose={() => {
          setSampleData(undefined);
        }}
      >
        <Container
          title={
            <p className="font-bold">
              Sample result: {sampleData?.result.status}
            </p>
          }
        >
          <div className="font-mono text-xs bg-blue-20 p-4 mx-4 mb-4 whitespace-pre overflow-x-auto">
            {sampleData?.result.body || "Empty response"}
          </div>
        </Container>
      </Modal>

      <FormNewOutboundWebhookModal
        app={app}
        isOpen={isModalOpen}
        onUpdate={() => {
          setRefreshToken(Date.now());
        }}
        toggleModal={(val: boolean) => {
          toggleModal(val);
          setWebhookToEdit(undefined);
        }}
        webhook={webhookToEdit}
      />
    </>
  );
};

export default FormOutboundWebhooks;
