import { useContext } from "react";
import cn from "classnames";
import Box from "@mui/material/Box";
import { useParams } from "react-router";
import { formattedDate } from "~/utils/helpers/deployments";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import Container from "~/components/Container";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBoxV2";
import Error404 from "~/components/Errors/Error404";
import Button from "~/components/ButtonV2";
import CommitInfo from "../_components/CommitInfo";
import DeploymentMenu from "../_components/DeploymentMenu";
import { useFetchDeployment, useWithPageRefresh } from "../actions";

const splitLines = (message: string): string[] => {
  // Remove first and last empty lines
  const lines = message
    .replace(/^[\\n\s]+|[\\n\s]+$/g, "")
    .replace(/\\n\\n+/g, "\n\n")
    .split("\n");

  return lines;
};

export default function Deployment() {
  const { deploymentId } = useParams();
  const { app, setRefreshToken } = useContext(AppContext);
  const { environment } = useContext(EnvironmentContext);
  const { deployment, error, loading } = useFetchDeployment({
    app,
    deploymentId,
  });

  useWithPageRefresh({ deployment, setRefreshToken });

  if (loading || error) {
    return (
      <Container maxWidth="max-w-none">
        <div className="w-full flex justify-center p-4">
          {loading && <Spinner />}
          {error && <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>}
        </div>
      </Container>
    );
  }

  if (!deployment) {
    return <Error404>The deployment is not found.</Error404>;
  }

  const showEmptyPackageWarning =
    deployment.exit === 0 &&
    !deployment.totalSizeInBytes &&
    !deployment.serverPackageSize;

  return (
    <Container
      maxWidth="max-w-none"
      className="pb-4"
      title={
        <CommitInfo
          clickable={false}
          environment={environment}
          app={app}
          deployment={deployment}
          showStatus
          showNotPublishedInfo
        />
      }
      actions={
        <div className="flex flex-col items-end justify-between">
          <DeploymentMenu
            deployment={deployment}
            app={app}
            environment={environment}
            setRefreshToken={setRefreshToken}
            omittedItems={["view-details"]}
          />
          <div className="text-xs">{formattedDate(deployment.createdAt)}</div>
        </div>
      }
    >
      <div className="py-4">
        {showEmptyPackageWarning && (
          <InfoBox type={InfoBox.WARNING} className="mx-4 mb-8">
            Deployment package is empty. Make sure that the build folder is
            specified properly.
          </InfoBox>
        )}
        {deployment.logs?.map(({ title, status, message = "" }, i) => (
          <Box key={title} data-testid={`deployment-step-${i}`} sx={{ mx: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                bgcolor: "rgba(0,0,0,0.1)",
              }}
            >
              <span
                className={cn("inline-block w-2 h-2", {
                  "bg-red-50": status === false,
                  "bg-blue-40": typeof status === "undefined" || null,
                  "bg-green-70":
                    status &&
                    (!showEmptyPackageWarning ||
                      i < deployment.logs.length - 1),
                  "bg-yellow-10":
                    status &&
                    showEmptyPackageWarning &&
                    deployment.logs.length - 1 === i,
                })}
              />
              <Box
                component="span"
                sx={{
                  fontFamily: "monospace",
                  ml: 1.75,
                  display: "inline-block",
                }}
              >
                {title}
              </Box>
            </Box>
            {message.length ? (
              <Box
                component="code"
                bgcolor="transparent"
                sx={{
                  fontFamily: "monospace",

                  display: "block",
                  py: 2,
                  lineHeight: 1.5,
                  overflow: "auto",
                  color: "white",
                }}
                style={{ maxHeight: "400px" }}
              >
                {splitLines(message).map((line, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      opacity: 0.5,
                      "&:hover": { opacity: 1, bgcolor: "rgba(0,0,0,0.1)" },
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        display: "inline-block",
                        minWidth: "50px",
                        maxWidth: "50px",
                        width: "100%",
                        textAlign: "right",
                        mr: 1,
                      }}
                    >
                      {i + 1}.
                    </Box>{" "}
                    {line}
                  </Box>
                ))}
              </Box>
            ) : (
              ""
            )}
          </Box>
        ))}
        {deployment.isRunning && (
          <div className="flex justify-center mt-4" id="deploy-spinner-running">
            <Spinner primary />
          </div>
        )}
        {!deployment.isRunning && deployment.exit === 0 && (
          <div className="flex justify-center mt-4">
            <Button href={deployment.preview} category="action">
              Preview
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
}
