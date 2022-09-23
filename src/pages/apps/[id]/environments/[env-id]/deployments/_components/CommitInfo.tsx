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
}) => {
  return (
    <div className="flex-1 flex items-baseline leading-6">
      {showStatus && (
        <div className="mr-3">
          <ExitStatus code={deployment.isRunning ? null : deployment.exit} />
        </div>
      )}
      <div>
        <Link to={`/apps/${app.id}/deployments/${deployment.id}`}>
          {deployment.commit?.message?.split("\n")[0] ||
            defaultMessage(deployment)}
        </Link>
        <ReleaseInfo
          percentage={
            deployment.published?.filter(p => p.envId === environment.id)[0]
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
