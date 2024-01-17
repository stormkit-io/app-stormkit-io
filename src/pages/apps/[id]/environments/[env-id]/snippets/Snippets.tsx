import { useState, useContext } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import CardRow from "~/components/CardRow";
import EmptyPage from "~/components/EmptyPage";
import ConfirmModal from "~/components/ConfirmModal";
import { useFetchSnippets, deleteSnippet, updateSnippet } from "./actions";
import SnippetModal from "./SnippetModal";

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

  return (
    <Card
      error={error}
      loading={loading}
      sx={{
        width: "100%",
        color: "white",
      }}
    >
      <CardHeader
        title="Snippets"
        subtitle={
          <>
            Snippets will be injected during response time into your document.
            <br />
            You can enable or disable any snippet without the need of a
            deployment.
          </>
        }
      />
      <Box>
        {snippets?.map(snippet => (
          <CardRow
            key={snippet.id}
            menuItems={[
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
          >
            <Box sx={{ display: "flex" }}>
              <Box sx={{ flex: 1 }}>
                <Typography>
                  #{snippet.id} {snippet.title}
                </Typography>
                <Typography>
                  {snippet.prepend ? "Prepened" : "Appended"} to{" "}
                  <b>{snippet.location}</b> element.
                </Typography>
              </Box>
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
            </Box>
          </CardRow>
        ))}
      </Box>
      {!snippets?.length && (
        <EmptyPage>
          It's quite empty in here.
          <br />
          Create a new snippet to manage them.
        </EmptyPage>
      )}
      <CardFooter>
        <Button
          variant="contained"
          color="secondary"
          type="button"
          onClick={() => {
            setIsSnippetModalOpen(true);
          }}
        >
          New Snippet
        </Button>
      </CardFooter>
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
    </Card>
  );
}
