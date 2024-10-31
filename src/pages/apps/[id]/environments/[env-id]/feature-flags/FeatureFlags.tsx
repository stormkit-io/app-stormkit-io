import { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import EmptyList from "~/components/EmptyPage";
import ConfirmModal from "~/components/ConfirmModal";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import CardRow from "~/components/CardRow";
import FeatureFlagModal from "./_components/FeatureFlagModal";
import * as actions from "./actions";

const { useFetchFeatureFlags, upsertFeatureFlag, deleteFeatureFlag } = actions;

interface FF {
  flagName: string;
  flagValue: boolean;
}

export default function FeatureFlags() {
  const { app } = useContext(AppContext);
  const { environment } = useContext(EnvironmentContext);
  const [toBeModified, setToBeModified] = useState<FF>();
  const [toBeDeleted, setToBeDeleted] = useState<FF>();
  const [toBeToggled, setToBeToggled] = useState<FF>();
  const [isFeatureFlagModalOpen, setFeatureFlagModal] = useState(false);
  const { error, loading, flags, setReload } = useFetchFeatureFlags({
    appId: app.id,
    environmentId: environment.id!,
  });

  return (
    <Card
      error={error}
      loading={loading}
      sx={{ width: "100%" }}
      contentPadding={false}
    >
      <CardHeader
        title="Feature flags"
        subtitle="Feature flags that are enabled will be accessible through the window.sk.features object."
      />

      {flags?.map((f, i) => (
        <CardRow
          key={f.flagName}
          menuItems={[
            {
              icon: "fa fa-pencil",
              text: "Modify",
              onClick: () => {
                setToBeToggled(undefined);
                setToBeModified(f);
                setFeatureFlagModal(true);
              },
            },
            {
              icon: "fa fa-times",
              text: "Delete",
              onClick: () => {
                setToBeModified(undefined);
                setToBeDeleted(f);
              },
            },
          ]}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ flex: 1 }}>
              <Typography>{f.flagName}</Typography>
            </Box>
            <FormControlLabel
              sx={{ pl: 0, ml: 0 }}
              label="Enabled"
              control={
                <Switch
                  sx={{ mr: 2 }}
                  name="ffEnabled"
                  color="secondary"
                  inputProps={{ "aria-label": `Toggle ${f.flagName} state` }}
                  checked={f.flagValue}
                  onChange={() => {
                    setToBeToggled(f);
                    setToBeModified(undefined);
                    setToBeDeleted(undefined);
                  }}
                />
              }
              labelPlacement="start"
            />
          </Box>
        </CardRow>
      ))}
      {!loading && !error && !flags?.length && (
        <EmptyList>
          <>
            It's quite empty in here.
            <br />
            Create a new feature flag to manage them.
          </>
        </EmptyList>
      )}
      <CardFooter sx={{ textAlign: "center" }}>
        <Button
          type="button"
          variant="contained"
          color="secondary"
          onClick={() => {
            setFeatureFlagModal(true);
          }}
        >
          New feature flag
        </Button>
      </CardFooter>
      {isFeatureFlagModalOpen && (
        <FeatureFlagModal
          app={app}
          environment={environment}
          flag={toBeModified}
          setReload={setReload}
          closeModal={() => {
            setToBeModified(undefined);
            setFeatureFlagModal(false);
          }}
        />
      )}
      {toBeToggled && flags && (
        <ConfirmModal
          onCancel={() => {
            setToBeToggled(undefined);
          }}
          onConfirm={({ setError, setLoading }) => {
            setLoading(true);

            upsertFeatureFlag({
              app,
              environment,
              values: {
                flagName: toBeToggled.flagName,
                flagValue: !toBeToggled.flagValue,
              },
            })
              .then(() => {
                setToBeToggled(undefined);
                setReload(Date.now());
              })
              .catch(res => {
                if (typeof res === "string") {
                  setError(res);
                } else {
                  setError("Something went wrong while updating feature flag.");
                }
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        >
          This will{" "}
          <Box component="b">
            {toBeToggled.flagValue ? "disable" : "enable"}
          </Box>
          the feature flag. Changes will be effective immediately.
        </ConfirmModal>
      )}
      {toBeDeleted && flags && (
        <ConfirmModal
          onCancel={() => {
            setToBeDeleted(undefined);
          }}
          onConfirm={({ setError, setLoading }) => {
            setLoading(true);
            deleteFeatureFlag({
              app,
              environment,
              flagName: toBeDeleted.flagName,
            })
              .then(() => {
                setToBeDeleted(undefined);
                setReload(Date.now());
              })
              .catch(res => {
                if (typeof res === "string") {
                  setError(res);
                } else {
                  setError("Something went wrong while deleting feature flag.");
                }
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        >
          This will delete the feature flag immediately and it won't be
          accessible anymore to the clients.
        </ConfirmModal>
      )}
    </Card>
  );
}
