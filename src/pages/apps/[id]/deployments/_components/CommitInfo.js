import React from "react";
import PropTypes from "prop-types";
import Link from "~/components/Link";
import { parseCommit } from "~/utils/helpers/deployments";
import PublishedInfo from "./PublishedInfo";

const CommitMessage = ({ deployment, commit }) => {
  const isPublished = deployment.published?.length > 0;

  if (isPublished === false) {
    return commit.msg;
  }

  if (commit.msg.length > 30) {
    return commit.msg.substring(0, 30) + "...";
  }

  return commit.msg;
};

CommitMessage.propTypes = {
  commit: PropTypes.object,
  deployment: PropTypes.object,
};

const CommitInfo = ({ deployment, environments }) => {
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
      <div className="opacity-75">
        {commit.branch && (
          <span>
            <span className="fas fa-code-branch mr-1" />
            {commit.branch},{" "}
          </span>
        )}
        {commit.author && <span>by {commit.author}</span>}
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

CommitInfo.propTypes = {
  deployment: PropTypes.object,
  environments: PropTypes.array,
};

export default CommitInfo;
