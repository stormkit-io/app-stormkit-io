import { useState } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/lab/LoadingButton";
import TextInput from "@mui/material/TextField";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "~/components/ModalV2";
import ConfirmModal from "~/components/ConfirmModal";
import Spinner from "~/components/Spinner";
import InputDescription from "~/components/InputDescription";
import { useFetchAPIKeys, generateNewAPIKey, deleteAPIKey } from "../actions";

interface Props {
  app: App;
  environment: Environment;
  setRefreshToken?: (v: number) => void; // This is there just to accomodate the Tab signature. It's not really used.
}

interface APIKeyModalProps {
  onClose: () => void;
  onSubmit: (name: string) => void;
  error?: string;
  loading?: boolean;
}

function APIKeyModal({ onSubmit, onClose, loading, error }: APIKeyModalProps) {
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
            onChange={e => setName(e.target.value.trim())}
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

export default function TabAPIKey({ app, environment: env }: Props) {
  const [isVisible, setIsVisible] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<number>();
  const [success, setSuccess] = useState(false);
  const [modalError, setModalError] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [apiKeyToDelete, setApiKeyToDelete] = useState<APIKey>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loading, error, keys, setKeys } = useFetchAPIKeys({
    appId: app.id,
    envId: env.id!,
    refreshToken,
  });

  const handleNewKey = (name: string) => {
    setModalLoading(true);
    setSuccess(false);

    generateNewAPIKey({
      appId: app.id,
      envId: env.id!,
      name,
      scope: "env",
    })
      .then(apiKey => {
        setKeys([...keys, apiKey]);
        setSuccess(true);
        setIsModalOpen(false);
      })
      .catch(async res => {
        if (res.status === 400) {
          const { error } = (await res.json()) as { error: string };
          setModalError(error);
        }
      })
      .finally(() => {
        setModalLoading(false);
      });
  };

  return (
    <Box sx={{ p: 2, color: "white" }}>
      <Typography variant="h6">API Key</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.5, mb: 2 }}>
        This key will allow you to interact with our API and modify this
        environment.
      </Typography>
      {loading && (
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Spinner />
        </Box>
      )}
      {error && (
        <Alert color="error" sx={{ m: 0, mb: 2 }}>
          <AlertTitle>Error</AlertTitle>
          <Typography>
            An error occurred while fetching your API key. Please try again
            later.
          </Typography>
        </Alert>
      )}
      {success && (
        <Alert color="success" sx={{ m: 0, mb: 2 }}>
          <AlertTitle>Success</AlertTitle>
          <Typography>Your API key has been successfully updated.</Typography>
        </Alert>
      )}
      {!error && !loading && (
        <>
          <Box>
            {keys.map(apiKey => (
              <Box
                key={apiKey.token}
                sx={{
                  mb: 2,
                  bgcolor: "rgba(0,0,0,0.1)",
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography>{apiKey.name}</Typography>
                    <Box
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        maxWidth: { md: "300px", lg: "none" },
                      }}
                    >
                      {isVisible === apiKey.id ? apiKey.token : "*".repeat(32)}
                    </Box>
                  </Box>
                  <Box>
                    <IconButton
                      title="Toggle visibility"
                      size="small"
                      sx={{
                        scale: "0.9",
                        opacity: 0.5,
                        ":hover": { opacity: 1 },
                      }}
                      onClick={() => {
                        setIsVisible(isVisible === apiKey.id ? "" : apiKey.id);
                      }}
                    >
                      {isVisible === apiKey.id ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </IconButton>
                    <IconButton
                      title="Remove API Key"
                      aria-label="Remove API Key"
                      size="small"
                      sx={{
                        scale: "0.9",
                        opacity: 0.5,
                        ":hover": { opacity: 1 },
                      }}
                      onClick={() => {
                        setApiKeyToDelete(apiKey);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))}
            {keys.length === 0 &&
              "You do not have an API key associated with this environment."}
          </Box>
          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button
              type="button"
              variant="contained"
              color="secondary"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              New API Key
            </Button>
          </Box>
        </>
      )}
      {isModalOpen && (
        <APIKeyModal
          error={modalError}
          loading={modalLoading}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleNewKey}
        />
      )}
      {apiKeyToDelete && (
        <ConfirmModal
          onCancel={() => {
            setApiKeyToDelete(undefined);
          }}
          onConfirm={({ setLoading, setError }) => {
            setLoading(true);
            setError(null);
            setSuccess(false);

            deleteAPIKey(apiKeyToDelete)
              .then(() => {
                setRefreshToken(Date.now());
              })
              .catch(() => {
                setError("Something went wrong while deleting the API key.");
              })
              .finally(() => {
                setLoading(false);
                setApiKeyToDelete(undefined);
              });

            return "";
          }}
        >
          <Typography>
            This will delete the API key.
            <br /> If you have any integration that uses this API key, it will
            stop working.
          </Typography>
        </ConfirmModal>
      )}
    </Box>
  );
}
