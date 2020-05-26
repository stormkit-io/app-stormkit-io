import React from "react";
import g from "lodash.get";

/**
 * Takes a textarea input, splits every line and creates an
 * object of key-value out of this.
 *
 * @example
 * NODE_ENV=production
 * BABEL_ENV=production
 * => { NODE_ENV: production, BABEL_ENV: production }
 */
export const nlToKeyValue = text => {
  return text
    .split("\n")
    .filter(i => i.trim())
    .reduce((obj, val) => {
      const [key, value] = val.trim().split(/=(.+)/);
      obj[key] = value.replace(/^['"]+|['"]+$/g, "");
      return obj;
    }, {});
};

/**
 * Formats a date.
 *
 * @param {*} ts
 */
export const formattedDate = ts => {
  const date = new Date(ts * 1000);
  const now = new Date();

  if (
    date.getDate() === now.getDate() &&
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  ) {
    return `Today at ${date.toLocaleString("de-CH", {
      hour: "2-digit",
      minute: "2-digit"
    })}`;
  }

  return date.toLocaleDateString("de-CH", {
    hour: "2-digit",
    minute: "2-digit"
  });
};

/**
 * Parses a deployment object and extracts useful info.
 *
 * @param {object} deployment
 */
export const parseCommit = deployment => {
  const logs = g(deployment, "logs", []);

  if (logs) {
    for (let i = 0; i < logs.length; i++) {
      const commit = g(deployment, ["logs", i, "payload", "commit"], {});
      const branch = g(deployment, ["logs", i, "payload", "branch"], "");
      const msg = (commit.message || "").split("\n")[0];
      const author = (commit.author || "").split("<")[0];

      if (msg) {
        return { author, branch, msg };
      }
    }
  }

  if (deployment.exit !== null && deployment.exit !== 0) {
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
export const bytesToMB = byte => `${(+byte / 1000000).toFixed(2)}MB`;
