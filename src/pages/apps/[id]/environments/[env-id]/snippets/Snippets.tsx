import { useState, useContext } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { grey } from "@mui/material/colors";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import CardRow from "~/components/CardRow";
import EmptyPage from "~/components/EmptyPage";
import ConfirmModal from "~/components/ConfirmModal";
import DomainSelector from "~/shared/domains/DomainSelector";
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
  const [hosts, setHosts] = useState<string>();
  const { loading, error, snippets } = useFetchSnippets({
    app,
    env,
    refreshToken,
    hosts,
  });

  const hasFilters = Boolean(hosts);

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
      {(hasFilters || snippets?.length) && (
        <Box sx={{ mb: 4, px: snippets?.length ? 4 : 0 }}>
          <DomainSelector
            variant="outlined"
            appId={app.id}
            envId={env.id!}
            fullWidth={false}
            onDomainSelect={d => {
              setHosts(d?.join(","));
            }}
            withDevDomains
            multiple
          />
        </Box>
      )}
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
                <Typography>{snippet.title}</Typography>
                <Typography sx={{ color: grey[500] }}>
                  Inserted {snippet.prepend ? "before" : "after"}{" "}
                  <Typography
                    component="span"
                    sx={{ fontFamily: "monospace", fontSize: 11 }}
                  >
                    {`<${snippet.prepend ? "/" : ""}${snippet.location}>`}
                  </Typography>
                </Typography>
                <Typography sx={{ color: grey[500] }}>
                  {snippet.rules?.hosts?.join(", ") || "All hosts"}
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
          {hasFilters ? (
            "Your search produced no results."
          ) : (
            <>
              It's quite empty in here.
              <br />
              Create a new snippet to manage them.
            </>
          )}
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
      {isSnippetModalOpen && (
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
