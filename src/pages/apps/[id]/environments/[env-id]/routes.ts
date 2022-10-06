import type { RouteProps } from "react-router";
import Async from "~/components/Async";

const routes: Array<RouteProps> = [
  {
    path: "/",
    element: Async(
      () => import("~/pages/apps/[id]/environments/[env-id]/config")
    ),
  },
  {
    path: "/logs",
    element: Async(
      () => import("~/pages/apps/[id]/environments/[env-id]/logs")
    ),
  },
  {
    path: "/feature-flags",
    element: Async(
      () => import("~/pages/apps/[id]/environments/[env-id]/feature-flags")
    ),
  },
  {
    path: "/snippets",
    element: Async(
      () => import("~/pages/apps/[id]/environments/[env-id]/snippets")
    ),
  },
  {
    path: "/domain",
    element: Async(
      () => import("~/pages/apps/[id]/environments/[env-id]/domain")
    ),
  },
  {
    path: "/deployments",
    element: Async(
      () => import("~/pages/apps/[id]/environments/[env-id]/deployments")
    ),
  },
  {
    path: "/deployments/:deploymentId",
    element: Async(
      () =>
        import("~/pages/apps/[id]/environments/[env-id]/deployments/Deployment")
    ),
  },
];

export default routes;
