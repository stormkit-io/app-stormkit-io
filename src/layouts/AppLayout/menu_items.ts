import type { MenuItem } from "~/components/SideMenu";
import { capitalize } from "~/utils/helpers/string";

interface AppMenuItem {
  text: string;
  icon: string;
  path: string;
}

export const appMenuItems = ({ app }: { app: App }): AppMenuItem[] => [
  {
    // List environments
    path: `/apps/${app.id}/environments`,
    text: "Environments",
    icon: "fas fa-th-large",
  },
  {
    // List team members
    path: `/apps/${app.id}/team`,
    text: "Team",
    icon: "fas fa-users",
  },
  {
    // List settings
    path: `/apps/${app.id}/settings`,
    text: "Settings",
    icon: "fas fa-gear",
  },
];

interface Path extends MenuItem {
  borderBottom?: boolean;
}

export const envMenuItems = ({
  app,
  env,
  pathname,
}: {
  app: App;
  env: Environment;
  pathname: string;
}): Array<Path> => {
  if (!env) {
    return [];
  }

  const envPath = `/apps/${app.id}/environments/${env.id}`;

  return [
    {
      icon: "fa-solid fa-wrench",
      text: `${capitalize(env.env)} environment configuration`,
      path: envPath,
      isActive: pathname === envPath,
    },
    {
      path: `${envPath}/deployments`,
      text: "Deployments",
      icon: "fas fa-ship",
      isActive: pathname.includes("/deployments"),
    },
    {
      icon: "far fa-chart-bar",
      text: "Logs",
      path: `${envPath}/logs`,
      isActive: pathname.includes("/logs"),
    },
    {
      icon: "fas fa-code",
      text: "Snippets",
      path: `${envPath}/snippets`,
      isActive: pathname.includes("/snippets"),
    },
    {
      icon: "fas fa-flag",
      text: "Feature Flags",
      path: `${envPath}/feature-flags`,
      isActive: pathname.includes("/feature-flags"),
    },
    {
      icon: "fas fa-globe",
      text: "Configure domain",
      path: `${envPath}/domain`,
      isActive: pathname.includes("/domain"),
    },
  ];
};
