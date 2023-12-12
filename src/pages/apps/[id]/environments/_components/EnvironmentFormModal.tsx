import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Modal from "~/components/Modal";
import InputDescription from "~/components/InputDescription";
import { insertEnvironment } from "../[env-id]/config/actions";
import { Typography } from "@mui/material";

interface Props {
  onClose: () => void;
  isOpen: boolean;
  app: App;
}

interface FormValues {
  name: string;
  branch: string;
}

const EnvironmentFormModal: React.FC<Props> = ({ isOpen, app, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        component="form"
        sx={{ p: 4 }}
        onSubmit={e => {
          e.preventDefault();

          const values = Object.fromEntries(
            new FormData(e.target as HTMLFormElement).entries()
          ) as unknown as FormValues;

          setError("");
          setLoading(true);

          insertEnvironment({
            app,
            values: { ...values, autoPublish: "on", autoDeploy: "all" },
          })
            .then(({ envId }) => {
              // We need to refresh a bunch of stuff, so it's easier to make a hard refresh.
              window.location.assign(`/apps/${app.id}/environments/${envId}`);
            })
            .catch(async res => {
              try {
                if (typeof res === "string") {
                  setError(res);
                } else {
                  const data = await res.json();

                  if (data.error) {
                    setError(data.error);
                  } else {
                    setError(Object.values(data.errors).join(""));
                  }
                }
              } catch {
                setError(
                  "Something went wrong while inserting the environment."
                );
              }
            })
            .finally(() => {
              setLoading(false);
            });
        }}
      >
        <Typography variant="h6">Create new environment</Typography>
        <Typography variant="subtitle2" sx={{ opacity: 0.5, mb: 4 }}>
          Environments allow you to work with different configurations.
        </Typography>
        <Box sx={{ mb: 4 }}>
          <TextField
            label="Environment name"
            name="name"
            fullWidth
            defaultValue={""}
            variant="filled"
            autoComplete="off"
            placeholder="Development"
            required
            autoFocus
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <TextField
            label="Environment branch"
            name="branch"
            fullWidth
            defaultValue={""}
            placeholder="release/development"
            variant="filled"
            autoComplete="off"
            required
          />
          <InputDescription>
            The default branch for this environment.
          </InputDescription>
        </Box>
        {error && (
          <Alert color="error" sx={{ mb: 4 }}>
            <AlertTitle>Error</AlertTitle>
            <Typography>{error}</Typography>
          </Alert>
        )}
        <Box sx={{ textAlign: "right" }}>
          <Button
            type="button"
            variant="text"
            color="info"
            sx={{ mr: 2 }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            loading={loading}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EnvironmentFormModal;
