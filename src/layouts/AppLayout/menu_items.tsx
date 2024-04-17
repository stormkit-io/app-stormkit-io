import { isSelfHosted } from "~/utils/helpers/instance";

export const appMenuItems = ({
  app,
  pathname,
}: {
  app: App;
  pathname: string;
}): Path[] => [
  {
    // List environments
    path: `/apps/${app.id}/environments`,
    text: "Environments",
    isActive: pathname.includes("/environments"),
  },
  {
    // List settings
    path: `/apps/${app.id}/settings`,
    text: "Settings",
    isActive: pathname.endsWith("/settings"),
  },
];

interface Path {
  path: string;
  icon?: React.ReactNode;
  text: React.ReactNode;
  isActive?: boolean;
}

export const envMenuItems = ({
  app,
  env,
  pathname,
}: {
  app: App;
  env: Environment;
  pathname: string;
}): Path[] => {
  if (!env) {
    return [];
  }

  const envPath = `/apps/${app.id}/environments/${env.id}`;

  const items = [
    {
      text: "Config",
      path: envPath,
      isActive: pathname === envPath,
    },
    {
      path: `${envPath}/deployments`,
      text: "Deployments",
      isActive:
        pathname.includes("/deployments") && !pathname.includes("runtime-logs"),
    },
    {
      text: "Snippets",
      path: `${envPath}/snippets`,
      isActive: pathname.includes("/snippets"),
    },
    {
      text: "Feature Flags",
      path: `${envPath}/feature-flags`,
      isActive: pathname.includes("/feature-flags"),
    },
    {
      text: "Triggers",
      path: `${envPath}/function-triggers`,
      isActive: pathname.includes("/function-triggers"),
    },
  ];

  if (isSelfHosted()) {
    items.push({
      text: "Key Value",
      path: `${envPath}/key-value`,
      isActive: pathname.includes("/key-value"),
    });
  }

  if (app.featureFlags?.SK_DATA_STORE) {
    items.push({
      text: "Data Store",
      path: `${envPath}/data-store`,
      isActive: pathname.includes("/data-store"),
    });
  }

  if (env.published?.length) {
    items.push({
      text: "Runtime logs",
      path: `${envPath}/deployments/${env.published[0].deploymentId}/runtime-logs`,
      isActive: pathname.includes("/runtime-logs"),
    });
  }

  items.push({
    text: "Analytics",
    path: `${envPath}/analytics`,
    isActive: pathname.includes("/analytics"),
  });

  return items;
};
