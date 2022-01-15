import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Form from "~/components/Form";
import InfoBox from "~/components/InfoBox";
import Button from "~/components/Button";
import Modal from "~/components/Modal";
import DotDotDot from "~/components/DotDotDot";
import Spinner from "~/components/Spinner";
import { RootContextProps } from "~/pages/Root.context";
import { truncate } from "~/utils/helpers/string";
import FormNewOutboundWebhookModal from "./FormOutboundWebhookModal";
import {
  useFetchOutboundWebhooks,
  sendSampleRequest,
  deleteOutboundWebhook,
} from "../_actions/outbound_webhook_actions";
import type { SendSampleRequestResponse } from "../_actions/outbound_webhook_actions";
import { OutboundWebhook } from "../types";

interface Props extends Pick<RootContextProps, "api"> {
  app: App;
}

const FormOutboundWebhooks: React.FC<Props> = ({
  api,
  app,
}): React.ReactElement => {
  const history = useHistory();
  const [loadingSample, setLoadingSample] = useState(false);
  const [webhookToEdit, setWebhookToEdit] = useState<OutboundWebhook>();
  const [sampleData, setSampleData] = useState<SendSampleRequestResponse>();
  const [isModalOpen, toggleModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const hooks = useFetchOutboundWebhooks({
    app,
    api,
    setError,
    setLoading,
  });

  return (
    <>
      <Form>
        <Form.Section
          label={
            <div className="flex items-center" id="outbound-webhooks">
              Outbound Webhooks
            </div>
          }
          marginBottom="mb-4"
        >
          {hooks.length ? (
            <Table>
              <TableBody>
                {hooks.map(hook => (
                  <TableRow key={hook.id}>
                    <TableCell>{truncate(hook.requestUrl, 50)}</TableCell>
                    <TableCell align="right">
                      <DotDotDot
                        aria-label={`Outbound webhook ${hook.id} menu`}
                      >
                        <DotDotDot.Item
                          onClick={close => {
                            setWebhookToEdit(hook);
                            toggleModal(true);
                            close();
                          }}
                        >
                          Edit
                        </DotDotDot.Item>
                        <DotDotDot.Item
                          onClick={close => {
                            setLoadingSample(true);

                            sendSampleRequest({ app, api, whId: hook.id })
                              .then(res => {
                                setLoadingSample(false);
                                setSampleData(res);
                              })
                              .finally(() => {
                                close();
                              });
                          }}
                        >
                          Trigger sample{" "}
                          {loadingSample && (
                            <Spinner
                              className="ml-2"
                              primary
                              width={4}
                              height={4}
                            />
                          )}
                        </DotDotDot.Item>
                        <DotDotDot.Item
                          icon="fas fa-trash-alt text-red-50 mr-2"
                          onClick={close => {
                            setLoading(true);
                            deleteOutboundWebhook({
                              app,
                              api,
                              whId: hook.id,
                            }).then(() => {
                              history.replace({
                                state: {
                                  outboundWebhooksRefresh: Date.now(),
                                },
                              });

                              close();
                            });
                          }}
                        >
                          Delete
                        </DotDotDot.Item>
                      </DotDotDot>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <InfoBox>
              You don't have any webhook installed. Click Add new webhook to
              create a new one.
            </InfoBox>
          )}
          {error && (
            <InfoBox type={InfoBox.ERROR} toaster dismissable>
              {error}
            </InfoBox>
          )}
        </Form.Section>
        <div className="flex justify-end">
          <Button
            primary
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
          className="max-w-screen-sm"
          isOpen={Boolean(sampleData)}
          onClose={() => {
            setSampleData(undefined);
          }}
        >
          <h3 className="mb-8 text-xl font-bold">
            Sample result: {sampleData?.result.status}
          </h3>
          <code>{sampleData?.result.body || "Empty response"}</code>
        </Modal>
      </Form>

      <FormNewOutboundWebhookModal
        app={app}
        api={api}
        isOpen={isModalOpen}
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
