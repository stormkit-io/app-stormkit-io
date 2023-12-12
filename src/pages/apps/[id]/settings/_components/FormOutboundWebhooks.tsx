import React, { useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/lab/LoadingButton";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import Modal from "~/components/Modal";
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
import { grey } from "@mui/material/colors";

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
    <Card error={error} sx={{ mb: 4 }}>
      <CardHeader
        title="Outbound webhooks"
        subtitle="Integrate external applications with Stormkit using webhooks."
      />
      <Box sx={{ mb: 4 }}>
        {hooks.length ? (
          hooks.map(hook => (
            <Box
              key={hook.id}
              sx={{
                bgcolor: "rgba(255,255,255,0.015)",
                border: `1px solid ${grey[900]}`,
                display: "flex",
                alignItems: "center",
                mb: 2,
                p: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: "bold" }}>
                  {hook.requestMethod?.toUpperCase()}
                </Typography>
                <Typography>{truncate(hook.requestUrl, 50)}</Typography>
                <Typography>
                  {hook.triggerWhen === "on_deploy"
                    ? "Triggered after each successful deployment"
                    : "Triggered after a deployment is published"}
                </Typography>
              </Box>
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
            </Box>
          ))
        ) : (
          <Alert color="info">
            <Typography>You don't have any webhooks installed.</Typography>
          </Alert>
        )}
      </Box>
      <CardFooter>
        <Button
          color="secondary"
          variant="contained"
          type="button"
          loading={loading}
          onClick={() => {
            toggleModal(true);
          }}
        >
          Add new webhook
        </Button>
      </CardFooter>
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

      {isModalOpen && (
        <FormNewOutboundWebhookModal
          app={app}
          isOpen
          onUpdate={() => {
            setRefreshToken(Date.now());
          }}
          toggleModal={(val: boolean) => {
            toggleModal(val);
            setWebhookToEdit(undefined);
          }}
          webhook={webhookToEdit}
        />
      )}
    </Card>
  );
};

export default FormOutboundWebhooks;
