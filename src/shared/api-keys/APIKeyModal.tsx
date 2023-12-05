import { useState } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Typography from "@mui/material/Typography";
import TextInput from "@mui/material/TextField";
import Button from "@mui/lab/LoadingButton";
import Modal from "~/components/ModalV2";
import InputDescription from "~/components/InputDescription";

interface APIKeyModalProps {
  onClose: () => void;
  onSubmit: (name: string) => void;
  error?: string;
  loading?: boolean;
}

export default function APIKeyModal({
  onSubmit,
  onClose,
  loading,
  error,
}: APIKeyModalProps) {
  const [name, setName] = useState<string>("");

  return (
    <Modal open onClose={onClose}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">Generate New Key</Typography>
        <Box sx={{ pt: 2 }}>
          <TextInput
            variant="filled"
            label="API Key name"
            placeholder="e.g. Default"
            fullWidth
            autoFocus
            autoComplete="off"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <InputDescription>
            The name will be used in the UI. It helps distinguishing your API
            keys.
          </InputDescription>
        </Box>
        {error && (
          <Alert color="error" sx={{ m: 0, mt: 2 }}>
            <AlertTitle>Error</AlertTitle>
            <Typography>{error}</Typography>
          </Alert>
        )}
        <Box sx={{ textAlign: "right", pt: 2 }}>
          <Button
            loading={loading}
            variant="contained"
            color="secondary"
            onClick={() => onSubmit(name)}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
