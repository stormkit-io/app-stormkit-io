import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/lab/LoadingButton";
import Modal from "~/components/ModalV2";
import Form from "~/components/FormV2";

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
    <Modal open onClose={onCancel}>
      <Box sx={{ p: 4 }}>
        <Typography
          variant="h2"
          sx={{ textAlign: "center", fontSize: 24, mb: 4, fontWeight: "bold" }}
        >
          Confirm action
        </Typography>
        <Box sx={{ textAlign: "center" }}>
          <Box sx={{ mb: 2 }}>
            {children}
            {!typeConfirmationText && (
              <Typography>Are you sure you want to continue?</Typography>
            )}
          </Box>

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
        </Box>
        {error && (
          <Alert color="error" sx={{ mt: 4 }}>
            <AlertTitle>Error</AlertTitle>
            <Typography>{error}</Typography>
          </Alert>
        )}
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button
            color="info"
            variant="text"
            type="button"
            sx={{ mr: 2 }}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            loading={loading}
            disabled={!confirmButtonEnabled}
            onClick={handleSuccess}
          >
            {confirmText || "Yes, continue"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmModal;
