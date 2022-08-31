import Async from "~/components/Async";
import { RouteProps } from "react-router-dom";

const routes: Array<RouteProps> = [
  {
    path: "/apps/:id",
    exact: true,
    component: Async(() => import("~/pages/apps/[id]")),
  },
  {
    path: "/apps/:id/environments/:envId",
    component: Async(() => import("~/pages/apps/[id]/environments/[env-id]")),
  },
  {
    path: "/apps/:id/environments",
    component: Async(
      () => import("~/pages/apps/[id]/environments/Environments")
    ),
  },
  {
    path: "/apps/:id/deployments",
    exact: true,
    component: Async(() => import("~/pages/apps/[id]/deployments")),
  },
  {
    path: "/apps/:id/deployments/:deploymentId",
    exact: true,
    component: Async(
      () => import("~/pages/apps/[id]/deployments/[deployment-id]")
    ),
  },
  {
    path: "/apps/:id/team",
    exact: true,
    component: Async(() => import("~/pages/apps/[id]/team")),
  },
  {
    path: "/apps/:id/settings",
    exact: true,
    component: Async(() => import("~/pages/apps/[id]/settings")),
  },
  {
    path: "/apps/:id/usage",
    exact: true,
    component: Async(() => import("~/pages/apps/[id]/usage")),
  },
];

export default routes;
