/**
 * Returns an env link given the env and app objects.
 */
export const getEnvironmentUrl = (env, app) => {
  if (!env || !env.env || !app) {
    console.error("Erroneous link, there's no env or app.");
    return "";
  }

  return `/app/${app.id}/envs/${env.env.toLowerCase().replace(" ", "-")}`;
};
