import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "~/components/Modal";
import Form from "~/components/Form";
import InfoBox from "~/components/InfoBox";
import Button from "~/components/Button";
import { connect } from "~/utils/context";
import { setDomain } from "../actions";

const ModalContext = Modal.Context();

const DomainModal = ({
  isOpen,
  toggleModal,
  api,
  app,
  environment,
  history,
}) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) {
    return "";
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
            aria-label="Domain name"
            required
            fullWidth
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

DomainModal.propTypes = {
  isOpen: PropTypes.bool,
  toggleModal: PropTypes.func,
  history: PropTypes.object,
  environment: PropTypes.object,
  api: PropTypes.object,
  app: PropTypes.object,
};

export default Object.assign(
  connect(DomainModal, [
    { Context: ModalContext, props: ["toggleModal", "isOpen"] },
  ]),
  ModalContext
);
