import React, { useContext } from "react";
import cn from "classnames";
import { useParams } from "react-router";
import { formattedDate } from "~/utils/helpers/deployments";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import Container from "~/components/Container";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBoxV2";
import CommitInfo from "./_components/CommitInfo";
import Error404 from "~/components/Errors/Error404";
import Button from "~/components/ButtonV2";
import DeploymentMenu from "./_components/DeploymentMenu";
import { useFetchDeployment } from "./actions";

const Deployment: React.FC = () => {
  const { deploymentId } = useParams();
  const { app, setRefreshToken } = useContext(AppContext);
  const { environment } = useContext(EnvironmentContext);
  const { deployment, error, loading } = useFetchDeployment({
    app,
    deploymentId,
  });

  if (loading || error) {
    return (
      <Container maxWidth="max-w-none">
        <div className="w-full flex justify-center">
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
          <div
            key={title}
            data-testid={`deployment-step-${i}`}
            className={cn("mx-4", {
              "mb-4": i < deployment.logs.length - 1,
            })}
          >
            <div className="flex justify-between pb-2">
              <span className="text-gray-50 text-sm">
                <span
                  className={cn("inline-block w-2 h-2 mr-3", {
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
                ></span>
                {title}
              </span>
            </div>
            {message.length ? (
              <code
                className="block bg-blue-10 text-sm p-4 text-gray-80 leading-relaxed overflow-y-auto"
                style={{ maxHeight: "400px", fontFamily: "monospace" }}
              >
                {message.split("\n").map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </code>
            ) : (
              ""
            )}
          </div>
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
};

export default Deployment;
