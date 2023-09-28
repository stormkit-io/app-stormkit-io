import { useState, useContext, useMemo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import AddIcon from "@mui/icons-material/Add";
import Switch from "@mui/material/Switch";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import EmptyPage from "~/components/EmptyPage";
import Spinner from "~/components/Spinner";
import DotDotDot from "~/components/DotDotDotV2";
import ConfirmModal from "~/components/ConfirmModal";
import { useFetchSnippets, deleteSnippet, updateSnippet } from "./actions";
import SnippetModal from "./_components/SnippetModal";

export default function Snippets() {
  const { app } = useContext(AppContext);
  const { environment: env } = useContext(EnvironmentContext);
  const [refreshToken, setRefreshToken] = useState(0);
  const [isSnippetModalOpen, setIsSnippetModalOpen] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState<Snippet | undefined>();
  const [toBeToggled, setToBeToggled] = useState<Snippet | undefined>();
  const [toBeModified, setToBeModified] = useState<Snippet | undefined>();
  const { loading, error, snippets } = useFetchSnippets({
    app,
    env,
    refreshToken,
  });

  const allSnippets = useMemo(() => {
    return snippets
      ? [...snippets.head, ...snippets.body].sort((s1, s2) =>
          s1.id! < s2.id! ? -1 : 1
        )
      : [];
  }, [snippets]);

  return (
    <Box
      bgcolor="container.paper"
      sx={{
        color: "white",
        p: 2,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="h6">Snippets</Typography>
          <Typography variant="subtitle2" sx={{ opacity: 0.5, mb: 2 }}>
            Snippets will be injected during response time into your document.
            <br />
            You can enable or disable any snippet without the need of a
            deployment.
          </Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Button
            variant="text"
            type="button"
            sx={{ color: "white" }}
            onClick={() => {
              setIsSnippetModalOpen(true);
            }}
          >
            <AddIcon sx={{ mr: 1 }} /> Create snippet
          </Button>
        </Box>
      </Box>

      <Box>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Spinner primary />
          </Box>
        )}
        {!loading && error && (
          <Alert color="error" sx={{ mb: 2 }}>
            <AlertTitle>Error</AlertTitle>
            <Typography>{error}</Typography>
          </Alert>
        )}
        {!loading && (
          <Box>
            <Box>
              {allSnippets.map(snippet => (
                <Box
                  key={snippet.id}
                  sx={{
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    "&:last-child": { borderBottom: "none" },
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "rgba(0,0,0,0.1)",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography>
                        #{snippet.id} {snippet.title}
                      </Typography>
                      <Typography>
                        {snippet.prepend ? "Prepened" : "Appended"} to{" "}
                        <b>{snippet.location}</b> element.
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <FormControlLabel
                        sx={{ pl: 0, ml: 0 }}
                        label="Enabled"
                        control={
                          <Switch
                            sx={{ mr: 2 }}
                            name="autoPublish"
                            color="secondary"
                            checked={snippet.enabled}
                            onChange={() => setToBeToggled(snippet)}
                          />
                        }
                        labelPlacement="start"
                      />
                      <DotDotDot
                        items={[
                          {
                            icon: "fa fa-pencil",
                            text: "Modify",
                            onClick: () => {
                              setToBeDeleted(undefined);
                              setToBeToggled(undefined);
                              setToBeModified(snippet);
                              setIsSnippetModalOpen(true);
                            },
                          },
                          {
                            icon: "fa fa-times",
                            text: "Delete",
                            onClick: () => {
                              setToBeModified(undefined);
                              setToBeToggled(undefined);
                              setToBeDeleted(snippet);
                            },
                          },
                        ]}
                      />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
            {!snippets?.head.length && !snippets?.body.length && (
              <EmptyPage>
                It's quite empty in here.
                <br />
                Create a new snippet to manage them.
              </EmptyPage>
            )}
          </Box>
        )}
        {isSnippetModalOpen && snippets && (
          <SnippetModal
            snippet={toBeModified}
            setRefreshToken={setRefreshToken}
            closeModal={() => {
              setToBeModified(undefined);
              setIsSnippetModalOpen(false);
            }}
          />
        )}
        {toBeToggled && snippets && (
          <ConfirmModal
            onCancel={() => {
              setToBeToggled(undefined);
            }}
            onConfirm={({ setError, setLoading }) => {
              setLoading(true);
              updateSnippet({
                appId: app.id,
                envId: env.id!,
                snippet: {
                  ...toBeToggled,
                  enabled: !toBeToggled.enabled,
                },
              })
                .then(() => {
                  setRefreshToken(Date.now());
                  setToBeToggled(undefined);
                })
                .catch(res => {
                  if (typeof res === "string") {
                    setError(res);
                  } else {
                    setError("Something went wrong while updating snippet.");
                  }
                })
                .finally(() => {
                  setLoading(false);
                });
            }}
          >
            <p>
              This will{" "}
              <span className="font-bold">
                {toBeToggled.enabled ? "disable" : "enable"}
              </span>{" "}
              the snippet. Changes will be effective immediately.
            </p>
          </ConfirmModal>
        )}
        {toBeDeleted && snippets && (
          <ConfirmModal
            onCancel={() => {
              setToBeDeleted(undefined);
            }}
            onConfirm={({ setError, setLoading }) => {
              setLoading(true);
              deleteSnippet({
                snippet: toBeDeleted,
                appId: app.id,
                envId: env.id!,
              })
                .then(() => {
                  setRefreshToken(Date.now());
                  setToBeDeleted(undefined);
                })
                .catch(res => {
                  if (typeof res === "string") {
                    setError(res);
                  } else {
                    setError("Something went wrong while deleting snippet.");
                  }
                })
                .finally(() => {
                  setLoading(false);
                });
            }}
          >
            <Typography>
              This will delete the snippet and it won't be injected anymore.
            </Typography>
          </ConfirmModal>
        )}
      </Box>
    </Box>
  );
}
