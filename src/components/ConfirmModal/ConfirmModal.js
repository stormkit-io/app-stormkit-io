import React, { useState, createContext } from "react";
import PropTypes from "prop-types";
import Modal from "~/components/Modal";
import Button from "~/components/Button";
import InfoBox from "~/components/InfoBox";
import { connect } from "~/utils/context";

const ModalContext = Modal.Context();
const context = createContext();

/**
 * Usage:
 *
 * 1. Import this component.
 * 2. Connect to it's context and specify `wrap: true`.
 * 3. A property called `confirmModal` is exported. Call that
 *    to display the modal. Signature is below.
 */
const ConfirmModal = ({ isOpen, toggleModal, children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [content, setContent] = useState();
  const [options, setOptions] = useState({});
  const closeModal = (...args) => toggleModal(false, ...args);

  const confirmModal = (content, callback, options = {}) => {
    if (typeof callback !== "function") {
      options = callback;
      callback = undefined;
    }

    setContent(content);
    setOptions({ ...options, callback });
    toggleModal(true);
  };

  const handleCancel = () => {
    if (options.onCancel) {
      options.onCancel(closeModal);
    } else {
      closeModal();
    }
  };

  const handleSuccess = (e) => {
    e.preventDefault();
    const cb = options.callback || options.onConfirm;

    if (cb) {
      cb({ setLoading, closeModal, setError });
    } else {
      closeModal();
    }
  };

  return (
    <context.Provider value={{ confirmModal }}>
      {children}
      <Modal
        isOpen={isOpen}
        onClose={handleCancel}
        className="sm:max-w-screen-sm"
      >
        <h2 className="font-bold text-2xl text-center mb-16">Confirm action</h2>
        <div className="text-sm text-center">
          <p className="mb-2">{content}</p>
          <p>Are you sure you want to continue?</p>
        </div>
        {error && (
          <InfoBox className="mt-8" type={InfoBox.ERROR}>
            {error}
          </InfoBox>
        )}
        <div className="mt-16 text-sm flex justify-center">
          <Button
            secondary
            type="button"
            className="py-2 mr-4"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            primary
            className="py-2"
            loading={loading}
            onClick={handleSuccess}
          >
            {options.confirmText || "Yes, continue"}
          </Button>
        </div>
      </Modal>
    </context.Provider>
  );
};

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool, // Whether the modal is open or not
  toggleModal: PropTypes.func,
  children: PropTypes.any,
};

const enhanced = connect(ConfirmModal, [
  { Context: ModalContext, props: ["toggleModal", "isOpen"], wrap: true },
]);

export default Object.assign(enhanced, {
  Consumer: context.Consumer,
  Provider: enhanced,
});
