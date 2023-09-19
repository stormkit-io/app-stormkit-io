import { useState } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/lab/LoadingButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Spinner from "~/components/Spinner";
import { useFetchAPIKey, generateNewAPIKey } from "../actions";

interface Props {
  app: App;
  environment: Environment;
  setRefreshToken: (v: number) => void;
}

export default function TabAPIKey({ app, environment: env }: Props) {
  const [isGeneratingNewAPIKey, setIsGeneratingNewAPIKey] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const { loading, error, apiKey, setApiKey } = useFetchAPIKey({
    appId: app.id,
    envId: env.id!,
  });

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
          <Box sx={{ bgcolor: "rgba(0,0,0,0.1)", p: 2 }}>
            {apiKey ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {isVisible ? apiKey : "*".repeat(48)}
                <IconButton
                  title="Toggle visibility"
                  onClick={() => {
                    setIsVisible(!isVisible);
                  }}
                >
                  {isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </Box>
            ) : (
              "You do not have an API key associated with this environment."
            )}
          </Box>
          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button
              type="button"
              variant="contained"
              color="secondary"
              loading={isGeneratingNewAPIKey}
              onClick={() => {
                setIsGeneratingNewAPIKey(true);
                setSuccess(false);

                generateNewAPIKey({ appId: app.id, envId: env.id! })
                  .then(({ apiKey }) => {
                    setApiKey(apiKey);
                    setSuccess(true);
                  })
                  .finally(() => {
                    setIsGeneratingNewAPIKey(false);
                  });
              }}
            >
              Generate new API Key
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
