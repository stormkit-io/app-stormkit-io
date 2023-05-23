import { useContext, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import emptyListSvg from "~/assets/images/empty-list.svg";
import DotDotDot from "~/components/DotDotDotV2";
import Spinner from "~/components/Spinner";
import ConfirmModal from "~/components/ConfirmModal";
import Button from "~/components/ButtonV2";
import InfoBox from "~/components/InfoBoxV2";
import Container from "~/components/Container";
import Form from "~/components/FormV2";
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
    <Container
      maxWidth="max-w-none"
      className="pb-0"
      title={
        <>
          <span>Feature flags</span>
          <Tooltip
            arrow
            className="flex items-center"
            title={
              <p>
                Feature flags that are enabled will be accessible through the
                window.sk.features object.
              </p>
            }
          >
            <span className="fas fa-question-circle text-lg ml-2" />
          </Tooltip>
        </>
      }
      actions={
        <Button
          type="button"
          category="button"
          onClick={() => {
            setFeatureFlagModal(true);
          }}
        >
          New feature flag
        </Button>
      }
    >
      <div className="w-full px-4 pb-4">
        {loading && (
          <div className="justify-center flex items-center w-full">
            <Spinner primary />
          </div>
        )}
        {!loading && error && (
          <InfoBox type={InfoBox.ERROR} className="mx-4">
            {error}
          </InfoBox>
        )}
        {!loading &&
          flags &&
          flags.map((f, i) => (
            <Box
              key={f.flagName}
              sx={{
                p: 2,
                mb: 2,
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                justifyContent: "space-between",
                ":last-child": {
                  mb: 0,
                },
              }}
              className="bg-blue-10"
            >
              <Box sx={{ maxWidth: "100%", overflowX: "auto" }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", fontSize: 14 }}
                >
                  {f.flagName}
                </Typography>
                <Box sx={{ opacity: 0.7 }}>
                  When enabled access through
                  <Box
                    component="span"
                    sx={{
                      display: { xs: "block", md: "inline-block" },
                      borderRadius: 1,
                      fontFamily: "monospace",
                      mt: { xs: 0.5, md: 0 },
                      p: 0.5,
                      ml: { xs: 0, md: 0.5 },
                    }}
                    className="bg-blue-20"
                    data-testid="ff-code"
                  >
                    window.sk.features["{f.flagName}"]
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: { xs: "100%", md: "auto" },
                  justifyContent: { xs: "space-between", md: "initial" },
                }}
              >
                <Form.Switch
                  color="secondary"
                  checked={f.flagValue}
                  className="mr-4"
                  inputProps={{ "aria-label": `Toggle ${f.flagName} state` }}
                  onChange={() => {
                    setToBeToggled(f);
                    setToBeModified(undefined);
                    setToBeDeleted(undefined);
                  }}
                />
                <DotDotDot
                  items={[
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
                />
              </Box>
            </Box>
          ))}
        {!loading && !error && !flags?.length && (
          <div className="p-4 flex items-center justify-center flex-col">
            <p className="mt-8">
              <img src={emptyListSvg} alt="No feature flags" />
            </p>
            <p className="mt-12">It is quite empty here.</p>
          </div>
        )}
      </div>
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
          <p>
            This will{" "}
            <span className="font-bold">
              {toBeToggled.flagValue ? "disable" : "enable"}
            </span>{" "}
            the feature flag. Changes will be effective immediately.
          </p>
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
          <p>
            This will delete the feature flag immediately and it won't be
            accessible anymore to the client.
          </p>
        </ConfirmModal>
      )}
    </Container>
  );
}
