import React, { useState, createContext, useEffect } from "react";
import Modal from "~/components/Modal";
import Form from "~/components/Form";
import Button from "~/components/Button";
import InfoBox from "~/components/InfoBox";
import { connect } from "~/utils/context";

const ModalContext = Modal.Context();
const context = createContext({});

type ConfirmModalCallback = ({
  setLoading,
  closeModal,
  setError,
}: {
  setLoading: (value: boolean) => void;
  closeModal: () => void;
  setError: (err: string | null) => void;
}) => void;

interface ConfirmModalOptions {
  onCancel?: (closeModal: () => void) => void;
  callback?: ConfirmModalCallback;
  onConfirm?: ConfirmModalCallback;
  /**
   * The confirmation text that will be shown to the user.
   */
  confirmText?: string;
  /**
   * When this prop is provided, the confirm modal will display an input
   * and will enable the confirm button only when input value matches this string.
   */
  typeConfirmationText?: string;
}

type ConfirmModalFn = (content: string, options: ConfirmModalOptions) => void;

export interface ConfirmModalProps {
  confirmModal: ConfirmModalFn;
}

interface Props {
  children: React.ReactNode;
}

interface ContextProps {
  isOpen: boolean;
  toggleModal: (onOrOff: boolean, ...rest: [unknown?]) => void;
}

/**
 * Usage:
 *
 * 1. Import this component.
 * 2. Connect to it's context and specify `wrap: true`.
 * 3. A property called `confirmModal` is exported. Call that
 *    to display the modal. Signature is below.
 */
const ConfirmModal: React.FC<Props & ContextProps> = ({
  isOpen,
  toggleModal,
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");
  const [options, setOptions] = useState<ConfirmModalOptions>({});
  const [confirmButtonEnabled, setConfirmButtonEnabled] = useState<boolean>(
    !options.typeConfirmationText
  );

  useEffect(() => {
    setConfirmButtonEnabled(!options.typeConfirmationText);
  }, [options.typeConfirmationText, isOpen]);

  const closeModal = (...args: [unknown?]) => {
    toggleModal(false, ...args);
    setLoading(false);
    setError(null);
  };

  const confirmModal: ConfirmModalFn = (content, options = {}) => {
    setContent(content);
    setOptions(options);
    toggleModal(true);
  };

  const handleCancel = () => {
    if (options.onCancel) {
      options.onCancel(closeModal);
    } else {
      closeModal();
    }
  };

  const handleSuccess = () => {
    if (options.onConfirm) {
      options.onConfirm({ setLoading, closeModal, setError });
    } else {
      closeModal();
    }
  };

  const verifyConfirmationInput = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.target.value === options.typeConfirmationText) {
      setConfirmButtonEnabled(true);
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

          {options.typeConfirmationText ? (
            <>
              <p>
                Type <b>{options.typeConfirmationText}</b> in order to proceed.
              </p>
              <Form.Input
                className="mt-4"
                placeholder={options.typeConfirmationText}
                onChange={verifyConfirmationInput}
                fullWidth
                autoFocus
              />
            </>
          ) : (
            <p>Are you sure you want to continue?</p>
          )}
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
            disabled={!confirmButtonEnabled}
            onClick={handleSuccess}
          >
            {options.confirmText || "Yes, continue"}
          </Button>
        </div>
      </Modal>
    </context.Provider>
  );
};

const enhanced = connect<Props, ContextProps>(ConfirmModal, [
  { Context: ModalContext, props: ["toggleModal", "isOpen"], wrap: true },
]);

export default Object.assign(enhanced, {
  Consumer: context.Consumer,
  Provider: enhanced,
});
