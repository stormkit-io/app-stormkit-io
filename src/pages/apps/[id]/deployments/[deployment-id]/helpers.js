import React from "react";
import Link from "~/components/Link";
import { formattedDate } from "~/utils/helpers/deployments";
import ExitStatus from "../_components/ExitStatus";

/**
 * Based on the deploy log step status, it returns an exit code. If the
 * deployment is still running and this is the last step, it returns null
 * which translates to running state. Otherwise returns 0 for success and
 * 1 for failed deployments (similar to bash).
 */
export const getExitCode = ({ deploy, status, index }) => {
  const isLast = index === deploy.logs.length - 1;
  const exitCodeSuccess = 0;
  const exitCodeFailure = 1;

  if (isLast && deploy.isRunning) {
    return null;
  }

  return status ? exitCodeSuccess : exitCodeFailure;
};

/**
 * Based on the deployment and commit information prepares an array
 * that can be iterated to display the deployment steps.
 */
export const prepareSettings = ({ deploy, commit }) => [
  {
    text: "Branch",
    value: commit.branch && (
      <span>
        <span className="fas fa-code-branch mr-1" />
        {commit.branch}
      </span>
    )
  },
  { text: "Configuration", value: deploy.config?.env },
  {
    text: "Started",
    value: deploy.createdAt && formattedDate(deploy.createdAt)
  },
  {
    text: "Stopped",
    value: deploy.stoppedAt && formattedDate(deploy.stoppedAt)
  },
  { text: "Build Status", value: <ExitStatus code={deploy.exit} /> },
  {
    text: "Endpoint",
    value: deploy.exit === 0 && deploy.preview && (
      <Link to={deploy.preview} secondary>
        {deploy.preview}
        <i className="fas fa-external-link-square-alt ml-2" />
      </Link>
    )
  }
];
