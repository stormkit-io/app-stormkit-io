/**
 * Receive a repo address in Stormkit format and
 * transform it to a URL.
 */
export const toRepoAddr = (repo: string): string => {
  if (!repo) {
    return "";
  }

  const [provider, ...rest] = repo.split("/");
  const address = rest.join("/");

  if (provider === "bitbucket") {
    return `bitbucket.org:${address}.git`;
  }

  if (provider === "github") {
    return `github.com:${address}.git`;
  }

  if (provider === "gitlab") {
    return `gitlab.com:${address}.git`;
  }

  return "";
};

/**
 * Formats the repository address in a Stormkit format.
 */
export const formatRepo = (repo: string): string => {
  if (!repo) {
    return "";
  }

  const providers = ["github.com", "bitbucket.org", "gitlab.com"];

  for (let i = 0; i < providers.length; i++) {
    const [provider] = providers[i].split(".");

    if (repo.indexOf(providers[i]) > -1) {
      if (repo.indexOf(`${providers[i]}:`) > -1) {
        // git@github.com:stormkit-io/app-www.git
        const [, project = ""] = repo.split(":");
        return `${provider}/${project.replace(".git", "")}`;
      } else {
        // https://github.com/stormkit-io/app-www
        const [, project] = repo.split(`${providers[i]}/`);
        return `${provider}/${project}`;
      }
    }
  }

  return "";
};

/**
 * Prefixes the hashtag (#) to the channel name to follow the Slack naming conventions.
 */
export const formattedSlackChannelName = (channel: string): string => {
  if (!channel) {
    return "";
  }

  return `#${channel.replace(/^#/, "")}`;
};
