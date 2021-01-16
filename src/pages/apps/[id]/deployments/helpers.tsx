import React from "react";
import Link from "~/components/Link";
import { formattedDate } from "~/utils/helpers/time";
import ExitStatus from "./_components/ExitStatus";

interface GetExitCodeProps {
  deploy: Deployment;
  status: number;
  index: number;
}

/**
 * Based on the deploy log step status, it returns an exit code. If the
 * deployment is still running and this is the last step, it returns null
 * which translates to running state. Otherwise returns 0 for success and
 * 1 for failed deployments (similar to bash).
 */
export const getExitCode = ({
  deploy,
  status,
  index
}: GetExitCodeProps): number | null => {
  const isLast = index === deploy.logs.length - 1;
  const exitCodeSuccess = 0;
  const exitCodeFailure = 1;

  if (isLast && deploy.isRunning) {
    return null;
  }

  return status ? exitCodeSuccess : exitCodeFailure;
};

interface PrepareSettingsProps {
  deploy: Deployment;
  commit: Commit;
}

interface PrepareSettingsReturnValue {
  text: string;
  value: React.ReactNode;
}

/**
 * Based on the deployment and commit information prepares an array
 * that can be iterated to display the deployment steps.
 */
export const prepareSettings = ({
  deploy,
  commit
}: PrepareSettingsProps): Array<PrepareSettingsReturnValue> => [
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

export interface Commit {
  author: string;
  branch: string;
  msg: React.ReactNode;
}

export interface PayloadCommit {
  branch: string;
  commit: {
    message: string;
    author: string;
  };
}

/**
 * Parses a deployment object and extracts useful info.
 *
 * @param {object} deployment
 */
export const parseCommit = (deployment?: Deployment): Commit => {
  if (deployment?.logs?.length) {
    for (let i = 0; i < deployment.logs.length; i++) {
      const payload = deployment.logs[i].payload as PayloadCommit;
      const commit = payload?.commit || {};
      const branch = payload?.branch || "";
      const msg = (commit.message || "").split("\n")[0];
      const author = (commit.author || "").split("<")[0];

      if (msg) {
        return { author, branch, msg };
      }
    }
  }

  if (deployment?.exit !== null && deployment?.exit !== 0) {
    return {
      author: "",
      branch: "",
      msg: (
        <div>
          Deployment has failed
          <br /> Mostly this happens when Stormkit cannot checkout your
          repository.
        </div>
      )
    };
  }

  return {
    author: "",
    branch: "",
    msg: (
      <div>
        Your deployment is queued up
        <br /> We will process it immediately as soon as we have available slots
      </div>
    )
  };
};

/**
 * Converts bytes to MB
 * @param {number} byte
 */
export const bytesToMB = (byte: string | number): string =>
  `${(+byte / 1000000).toFixed(2)}MB`;
