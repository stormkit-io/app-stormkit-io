import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/lab/LoadingButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteIcon from "@mui/icons-material/Delete";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import CardRow from "~/components/CardRow";
import ConfirmModal from "~/components/ConfirmModal";
import APIKeyModal from "~/shared/api-keys/APIKeyModal";
import * as actions from "~/shared/api-keys/actions";

const { useFetchAPIKeys, generateNewAPIKey, deleteAPIKey } = actions;

interface Props {
  app: App;
  environment: Environment;
  setRefreshToken?: (v: number) => void; // This is there just to accomodate the Tab signature. It's not really used.
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
    <Card
      id="api-keys"
      loading={loading}
      info={
        !loading && keys.length === 0
          ? "You do not have an API key associated with this environment."
          : ""
      }
      error={
        error
          ? "An error occurred while fetching your API key. Please try again later."
          : ""
      }
      success={success ? "Your API key has been successfully updated." : ""}
    >
      <CardHeader
        title="API Keys"
        subtitle="This key will allow you to interact with our API and modify this environment."
      />

      <Box>
        {keys.map(apiKey => (
          <CardRow key={apiKey.token}>
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
          </CardRow>
        ))}
      </Box>

      <CardFooter>
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
      </CardFooter>

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
          This will delete the API key. If you have any integration that uses
          this key, it will stop working.
        </ConfirmModal>
      )}
    </Card>
  );
}
