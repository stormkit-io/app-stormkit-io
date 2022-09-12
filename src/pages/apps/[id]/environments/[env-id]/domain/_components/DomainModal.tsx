import React, { useContext, useState } from "react";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import Modal from "~/components/Modal";
import Form from "~/components/Form";
import InfoBox from "~/components/InfoBox";
import Button from "~/components/Button";
import { setDomain } from "../actions";

interface Props {
  onClose: () => void;
}

const DomainModal: React.FC<Props> = ({ onClose }) => {
  const { app } = useContext(AppContext);
  const { environment } = useContext(EnvironmentContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <Modal isOpen onClose={onClose} className="max-w-screen-md">
      <h2 className="mb-8 text-xl font-bold">Set up a new domain</h2>
      <Form
        handleSubmit={setDomain({
          setError,
          setLoading,
          app,
          environment,
        })}
      >
        <div className="mb-4 p-4 rounded bg-gray-85">
          <Form.Input
            name="domain"
            label="Domain name"
            className="bg-white"
            required
            fullWidth
            inputProps={{
              "aria-label": "Domain name",
            }}
          />
          <p className="opacity-50 text-sm pt-2">
            Specify the domain you'd like to host on Stormkit.
          </p>
        </div>
        {error && (
          <InfoBox className="mb-4" type={InfoBox.ERROR}>
            {error}
          </InfoBox>
        )}
        <div className="flex justify-center">
          <Button primary loading={loading}>
            Start verification process
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default DomainModal;
