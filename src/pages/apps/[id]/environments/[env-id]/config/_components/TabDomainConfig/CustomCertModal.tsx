import { FormEventHandler, useState } from "react";
import Button from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Modal from "~/components/Modal";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import { updateCustomCert, deleteCustomCert } from "./actions";

interface Props {
  onClose: () => void;
  onUpdate: () => void;
  setSuccess: (s?: string) => void;
  domain: Domain;
  appId: string;
  envId: string;
}

export default function CustomCertModal({
  onClose,
  onUpdate,
  setSuccess,
  appId,
  envId,
  domain,
}: Props) {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const handler: FormEventHandler = e => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<
      string,
      string
    >;

    updateCustomCert({
      setLoading,
      setError,
      setSuccess,
      appId,
      envId,
      domainId: domain.id,
      certKey: data["certKey"],
      certValue: data["certValue"],
    }).then(shouldUpdate => {
      console.log("should update", shouldUpdate);
      shouldUpdate && onUpdate();
    });
  };

  return (
    <Modal open onClose={onClose}>
      <Card component="form" error={error} onSubmit={handler}>
        <CardHeader title="Configure custom certificate" />
        <Box sx={{ mb: 4 }}>
          <TextField
            multiline
            minRows={10}
            maxRows={10}
            label="Certificate"
            variant="filled"
            autoComplete="off"
            defaultValue={domain.customCert?.value || ""}
            fullWidth
            name="certValue"
            autoFocus
            required
            helperText={
              <Box component="span" sx={{ mt: 1, display: "block" }}>
                The certificate value in PEM format.
              </Box>
            }
            inputProps={{
              "aria-label": "Certificate",
            }}
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <TextField
            multiline
            minRows={10}
            maxRows={10}
            label="Private key"
            variant="filled"
            autoComplete="off"
            fullWidth
            name="certKey"
            defaultValue={domain.customCert?.key || ""}
            required
            helperText={
              <Box component="span" sx={{ mt: 1, display: "block" }}>
                The private key used to create the certificate.
              </Box>
            }
            inputProps={{
              "aria-label": "Private key",
            }}
          />
        </Box>
        <CardFooter>
          <Button
            type="button"
            variant="text"
            color="primary"
            disabled={!domain.customCert}
            sx={{ mr: 1 }}
            loading={loading}
            onClick={() =>
              deleteCustomCert({
                setLoading,
                setError,
                setSuccess,
                domainId: domain.id,
                appId,
                envId,
              }).then(shouldUpdate => {
                shouldUpdate && onUpdate();
              })
            }
          >
            Delete
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            loading={loading}
          >
            Configure
          </Button>
        </CardFooter>
      </Card>
    </Modal>
  );
}
