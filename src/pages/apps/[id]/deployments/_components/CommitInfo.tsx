import React from "react";
import { emojify } from "node-emoji";
import Link from "~/components/Link";
import AppContext from "~/pages/apps/App.context";
import { connect } from "~/utils/context";
import { parseCommit } from "~/utils/helpers/deployments";
import type { Commit } from "~/utils/helpers/deployments";
import PublishedInfo from "./PublishedInfo";

interface Props {
  deployment: Deployment;
  environments: Array<Environment>;
}

interface ContextProps {
  app: App;
}

interface CommitMessageProps {
  deployment: Deployment;
  commit: Commit;
}

const CommitMessage: React.FC<CommitMessageProps> = ({
  deployment,
  commit,
}): React.ReactElement => {
  const isPublished = deployment.published?.length > 0;

  if (typeof commit.msg === "string") {
    commit.msg = emojify(commit.msg);
  }

  // No need to shorten if it's not published
  if (!isPublished) {
    return <span>{commit.msg}</span>;
  }

  if (typeof commit.msg === "string" && commit.msg.length > 30) {
    return <span>{commit.msg.substring(0, 30)}...</span>;
  }

  return <span>{commit.msg}</span>;
};

interface ShaLinkProps {
  app: App;
  deployment: Deployment;
}

const ShaLink: React.FC<ShaLinkProps> = ({ app, deployment }) => {
  let link = "";

  if (!deployment.commit || !deployment.commit.sha) {
    return null;
  }

  const shortSha = deployment.commit.sha.slice(0, 8);

  if (!shortSha) {
    return null;
  }

  if (app.provider == "github") {
    link = `${app.repo.replace("github", "https://github.com")}/commit/${
      deployment.commit.sha
    }`;
  } else if (app.provider == "gitlab") {
    link = `${app.repo.replace("gitlab", "https://gitlab.com")}/-/commit/${
      deployment.commit.sha
    }`;
  } else {
    link = `${app.repo.replace("bitbucket", "https://bitbucket.org")}/commits/${
      deployment.commit.sha
    }`;
  }

  return (
    <Link to={link} tertiary>
      {shortSha}
    </Link>
  );
};

const CommitInfo: React.FC<Props & ContextProps> = ({
  deployment,
  environments,
  app,
}): React.ReactElement => {
  const commit = parseCommit(deployment);
  const env = environments.filter(e => e.env === deployment.config.env)[0];
  const urls = {
    environment: `/apps/${deployment.appId}/environments/${env?.id}`,
    deployment: `/apps/${deployment.appId}/deployments/${deployment.id}`,
  };

  return (
    <>
      <div className="font-bold max-w-128 truncate">
        <Link tertiary to={urls.deployment}>
          <CommitMessage commit={commit} deployment={deployment} />
        </Link>
        <PublishedInfo deployment={deployment} environments={environments} />
      </div>
      <div className="text-sm text-gray-500">
        {commit.branch && (
          <span>
            <span className="fas fa-code-branch mr-1" />
            {commit.branch},{" "}
          </span>
        )}
        <ShaLink app={app} deployment={deployment} />,
        {commit.author && <span> by {commit.author}</span>}
        {commit.branch && (
          <div className="mt-1">
            Using{" "}
            <Link tertiary to={urls.environment}>
              {deployment.config.env}
            </Link>{" "}
            configuration
          </div>
        )}
      </div>
    </>
  );
};

export default connect<Props, ContextProps>(CommitInfo, [
  { Context: AppContext, props: ["app"] },
]);
