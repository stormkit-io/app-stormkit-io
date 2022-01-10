import React, { useState } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useLocation, useHistory } from "react-router-dom";
import { connect } from "~/utils/context";
import Form from "~/components/Form";
import InfoBox from "~/components/InfoBox";
import Button from "~/components/Button";
import type { ModalContextProps } from "~/components/Modal";
import { RootContextProps } from "~/pages/Root.context";
import FormNewOutboundWebhookModal from "./FormNewOutboundWebhookModal";
import { useFetchOutboundWebhooks } from "../_actions/outbound_webhook_actions";

interface Props extends Pick<RootContextProps, "api"> {
  app: App;
}

const FormOutboundWebhooks: React.FC<Props & ModalContextProps> = ({
  api,
  app,
  toggleModal,
}): React.ReactElement => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hooks = useFetchOutboundWebhooks({
    app,
    api,
    setError,
    setLoading,
  });

  return (
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
          hooks.map(hook => hook.id)
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
          loading={loading}
          onClick={() => {
            toggleModal(true);
          }}
        >
          Add new webhook
        </Button>
      </div>
      <FormNewOutboundWebhookModal app={app} api={api} />
    </Form>
  );
};

export default connect<Props, ModalContextProps>(FormOutboundWebhooks, [
  {
    Context: FormNewOutboundWebhookModal,
    props: ["toggleModal"],
    wrap: true,
  },
]);
