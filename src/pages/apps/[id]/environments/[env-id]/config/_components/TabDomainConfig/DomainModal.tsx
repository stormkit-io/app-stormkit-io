import React, { useContext, useState } from "react";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import Modal from "~/components/Modal";
import Container from "~/components/Container";
import Form from "~/components/FormV2";
import InfoBox from "~/components/InfoBoxV2";
import Button from "~/components/ButtonV2";
import { setDomain } from "./actions";

interface Props {
  onClose: () => void;
  setRefreshToken: (val: number) => void;
}

const DomainModal: React.FC<Props> = ({ onClose, setRefreshToken }) => {
  const { app } = useContext(AppContext);
  const { environment } = useContext(EnvironmentContext);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  return (
    <Modal open onClose={onClose}>
      <Container title="Setup a new domain">
        <Form<{ domain: string }>
          handleSubmit={values => {
            setLoading(true);
            setError(undefined);
            setDomain({
              app,
              environment,
              values,
            })
              .then(() => {
                setRefreshToken(Date.now());
                onClose?.();
              })
              .catch(res => {
                setError(
                  res.status === 400
                    ? "Please provide a valid domain name."
                    : res.status === 429
                    ? "You have issued too many requests. Please wait a while before retrying."
                    : "Something went wrong while setting up the domain. Make sure it is a valid domain."
                );
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        >
          <Form.WithLabel label="Domain name" className="pt-0">
            <Form.Input
              name="domain"
              className="bg-white"
              placeholder="e.g. www.stormkit.io"
              required
              fullWidth
              inputProps={{
                "aria-label": "Domain name",
              }}
            />
          </Form.WithLabel>
          {error && (
            <InfoBox className="mb-4 mx-4" type={InfoBox.ERROR}>
              {error}
            </InfoBox>
          )}
          <div className="flex justify-center mb-4">
            <Button category="action" loading={loading}>
              Start verification process
            </Button>
          </div>
        </Form>
      </Container>
    </Modal>
  );
};

export default DomainModal;
