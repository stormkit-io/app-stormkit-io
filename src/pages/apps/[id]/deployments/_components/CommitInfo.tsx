import React from "react";
import { emojify } from "node-emoji";
import Link from "~/components/Link";
import { parseCommit } from "~/utils/helpers/deployments";
import type { Commit } from "~/utils/helpers/deployments";
import PublishedInfo from "./PublishedInfo";

interface Props {
  app: App;
  deployment: Deployment;
  environments: Array<Environment>;
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

const CommitInfo: React.FC<Props> = ({
  app,
  deployment,
  environments,
}): React.ReactElement => {
  const commit = parseCommit(deployment);
  const env = environments.filter(e => e.env === deployment.config.env)[0];
  const urls = {
    environment: `/apps/${deployment.appId}/environments/${env?.id}`,
    deployment: `/apps/${deployment.appId}/deployments/${deployment.id}`,
  };

  const linkByProvider= () => {
    let link = ""

    if (deployment.commit === null || deployment.commit === undefined) {
      return null;
    }

    const shortSha = deployment?.commit.sha!== undefined ? deployment.commit.sha.slice(0,8) : ""
    if (app.provider == "github") {
      link = `${app.repo.replace("github", "https://github.com")}/commit/${deployment.commit.sha}`
    } else if (app.provider == "gitlab") {
      link = `${app.repo.replace("gitlab", "https://gitlab.com")}/-/commit/${deployment.commit.sha}`
      // bitbucket
    } else {
      link = `${app.repo.replace("bitbucket", "https://bitbucket.org")}/commits/${deployment.commit.sha}`
    }

    return(
       <Link to={link}>{shortSha}</Link>
    )
  }

  return (
    <>
      <div className="font-bold max-w-128 truncate">
        <Link tertiary to={urls.deployment}>
          <CommitMessage commit={commit} deployment={deployment} />
        </Link>
        <PublishedInfo deployment={deployment} environments={environments} />
      </div>
      <div className="opacity-75">
        {commit.branch && (
          <span>
            <span className="fas fa-code-branch mr-1" />
            {commit.branch},{" "}
          </span>
        )}
        {linkByProvider()}
        {commit.author && <span> by {commit.author}</span>}
        {commit.branch && (
          <div className="">
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

export default CommitInfo;
