import React from "react";
import Link from "~/components/Link";
import ExitStatus from "./ExitStatus";
import Author from "./Author";
import Sha from "./Sha";
import ReleaseInfo from "./ReleaseInfo";

interface Props {
  environment: Environment;
  deployment: Deployment;
  app: App;
  showStatus?: boolean;
  showNotPublishedInfo?: boolean;
  clickable?: boolean;
}

const defaultMessage = (deployment: Deployment): React.ReactNode => {
  if (deployment.isRunning) {
    return "Commit message is being parsed...";
  }

  return deployment.exit === 0 ? (
    `#${deployment.id}`
  ) : (
    <>
      <div>Deployment failed.</div>
      <div>
        Stormkit has no access to the repo or the branch does not exist.
      </div>
    </>
  );
};

const CommitInfo: React.FC<Props> = ({
  deployment,
  app,
  environment,
  showStatus,
  showNotPublishedInfo,
  clickable = true,
}) => {
  const message =
    deployment.commit?.message?.split("\n")[0] || defaultMessage(deployment);

  const emptyPackage =
    deployment.exit === 0 &&
    !deployment.totalSizeInBytes &&
    !deployment.serverPackageSize;

  return (
    <div className="flex-1 flex items-baseline leading-6">
      {showStatus && (
        <div className="mr-3">
          <ExitStatus
            code={deployment.isRunning ? null : deployment.exit}
            emptyPackage={emptyPackage}
          />
        </div>
      )}
      <div>
        {clickable ? (
          <Link
            to={`/apps/${app.id}/environments/${environment.id}/deployments/${deployment.id}`}
          >
            {message}
          </Link>
        ) : (
          <span>{message}</span>
        )}
        <ReleaseInfo
          showNotPublishedInfo={showNotPublishedInfo}
          percentage={
            deployment.published?.find(p => p.envId === environment.id)
              ?.percentage ||
            environment.published?.find(p => p.deploymentId === deployment.id)
              ?.percentage
          }
        />
        <div className="flex items-center text-gray-50 text-xs mb-1">
          <div className="flex items-center">
            <span className="fa fa-code-branch mr-1" />
            {deployment.branch}
          </div>
          <Sha
            repo={app.repo}
            provider={app.provider}
            sha={deployment.commit.sha}
          />
        </div>
        <div className="text-gray-50 text-xs">
          <Author author={deployment.commit.author} />
        </div>
      </div>
    </div>
  );
};

export default CommitInfo;
