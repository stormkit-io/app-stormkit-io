import React, { useState } from "react";
import Modal, { ModalContextProps } from "~/components/Modal";
import { RootContextProps } from "~/pages/Root.context";
import Form from "~/components/Form";
import InfoBox from "~/components/InfoBox";
import Button from "~/components/Button";
import { connect } from "~/utils/context";
import { setDomain } from "../actions";
import { useHistory } from "react-router";

const ModalContext = Modal.Context();

interface Props extends Pick<RootContextProps, "api"> {
  app: App;
  environment: Environment;
}

const DomainModal: React.FC<Props & ModalContextProps> = ({
  isOpen,
  toggleModal,
  api,
  app,
  environment,
}) => {
  const history = useHistory();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) {
    return <></>;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => toggleModal(false)}
      className="max-w-screen-md"
    >
      <h2 className="mb-8 text-xl font-bold">Set up a new domain</h2>
      <Form
        handleSubmit={setDomain({
          setError,
          setLoading,
          api,
          app,
          environment,
          history,
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

export default Object.assign(
  connect<Props, ModalContextProps>(DomainModal, [
    { Context: ModalContext, props: ["toggleModal", "isOpen"] },
  ]),
  ModalContext
);
