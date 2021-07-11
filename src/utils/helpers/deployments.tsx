import React from "react";

/**
 * Formats a date.
 *
 * @param {*} ts
 */
export const formattedDate = (ts: number): string => {
  const date = new Date(ts * 1000);
  const now = new Date();

  if (
    date.getDate() === now.getDate() &&
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  ) {
    return `Today at ${date.toLocaleDateString("de-CH", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  return date.toLocaleDateString("de-CH", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface Commit {
  author: string;
  branch: string;
  msg: React.ReactNode;
}

interface PayloadCommit {
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
      ),
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
    ),
  };
};

/**
 * Converts bytes to MB
 * @param {number} byte
 */
export const bytesToMB = (byte: string | number): string =>
  `${(+byte / 1000000).toFixed(2)}MB`;
