import React, { useState } from "react";
import Modal from "~/components/Modal";
import Form from "~/components/Form";
import Button from "~/components/Button";
import InfoBox from "~/components/InfoBox";

type ConfirmModalCallback = ({
  setLoading,
  setError,
}: {
  setLoading: (value: boolean) => void;
  setError: (err: string | null) => void;
}) => void;

interface Props {
  children?: React.ReactNode;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: ConfirmModalCallback;
  typeConfirmationText?: string;
}

const ConfirmModal: React.FC<Props> = ({
  children,
  confirmText,
  typeConfirmationText,
  onConfirm,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmButtonEnabled, setConfirmButtonEnabled] = useState<boolean>(
    !typeConfirmationText
  );

  const handleSuccess = () => {
    if (onConfirm) {
      onConfirm({ setLoading, setError });
    }
  };

  const verifyConfirmationInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === typeConfirmationText) {
      setConfirmButtonEnabled(true);
    }
  };

  return (
    <Modal isOpen onClose={onCancel} className="sm:max-w-screen-sm">
      <h2 className="font-bold text-2xl text-center mb-16">Confirm action</h2>
      <div className="text-sm text-center">
        <p className="mb-2">{children}</p>

        {typeConfirmationText ? (
          <>
            <p>
              Type <b>{typeConfirmationText}</b> in order to proceed.
            </p>
            <Form.Input
              className="mt-4"
              placeholder={typeConfirmationText}
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
          onClick={onCancel}
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
          {confirmText || "Yes, continue"}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
