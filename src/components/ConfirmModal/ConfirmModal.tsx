import React, { useState } from "react";
import Modal from "~/components/ModalV2";
import Form from "~/components/FormV2";
import Container from "~/components/Container";
import Button from "~/components/ButtonV2";
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
    <Modal open onClose={onCancel} className="sm:max-w-screen-sm">
      <Container className="p-4">
        <h2 className="font-bold text-2xl text-center mb-12">Confirm action</h2>
        <div className="text-sm text-center">
          <div className="mb-2">
            {children}
            {!typeConfirmationText && " Are you sure you want to continue?"}
          </div>

          {typeConfirmationText && (
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
          )}
        </div>
        {error && (
          <InfoBox className="mt-8" type={InfoBox.ERROR}>
            {error}
          </InfoBox>
        )}
        <div className="mt-12 text-sm flex justify-center">
          <Button
            category="cancel"
            type="button"
            className="mr-4 bg-blue-20"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            category="action"
            loading={loading}
            disabled={!confirmButtonEnabled}
            onClick={handleSuccess}
          >
            {confirmText || "Yes, continue"}
          </Button>
        </div>
      </Container>
    </Modal>
  );
};

export default ConfirmModal;
