import Async from "~/components/Async";

export const routes = [
  {
    path: "/environments",
    element: Async(() => import("~/pages/apps/[id]/environments")),
  },
  {
    path: "/environments/default",
    element: Async(() => import("~/pages/apps/[id]/environments/Default")),
  },
  {
    path: "/environments/:envId/*",
    element: Async(() => import("~/pages/apps/[id]/environments/[env-id]")),
  },
  {
    path: `/team`,
    element: Async(() => import("~/pages/apps/[id]/team")),
  },
  {
    path: `/settings`,
    element: Async(() => import("~/pages/apps/[id]/settings")),
  },
  {
    path: `/deployments`,
    element: Async(() => import("~/pages/apps/[id]/deployments")),
  },
  {
    path: "/deployments/:deploymentId",
    element: Async(
      () => import("~/pages/apps/[id]/deployments/[deployment-id]")
    ),
  },
  {
    path: `/usage`,
    element: Async(() => import("~/pages/apps/[id]/usage")),
  },
];
