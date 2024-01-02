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
    path: "/key-value",
    element: Async(
      () => import("~/pages/apps/[id]/environments/[env-id]/kv")
    ),
  },
  {
    path: "/function-triggers",
    element: Async(
      () => import("~/pages/apps/[id]/environments/[env-id]/function-triggers")
    ),
  },
  {
    path: "/snippets",
    element: Async(
      () => import("~/pages/apps/[id]/environments/[env-id]/snippets")
    ),
  },
  {
    path: "/deployments",
    element: Async(
      () => import("~/pages/apps/[id]/environments/[env-id]/deployments")
    ),
  },
  {
    path: "/data-store",
    element: Async(
      () =>
        import("~/pages/apps/[id]/environments/[env-id]/datastore/Collections")
    ),
  },
  {
    path: "/data-store/:collection",
    element: Async(
      () => import("~/pages/apps/[id]/environments/[env-id]/datastore/Records")
    ),
  },
  {
    path: "/deployments/:deploymentId",
    element: Async(
      () =>
        import(
          "~/pages/apps/[id]/environments/[env-id]/deployments/[deployment-id]"
        )
    ),
  },
  {
    path: "/deployments/:deploymentId/runtime-logs",
    element: Async(
      () =>
        import(
          "~/pages/apps/[id]/environments/[env-id]/deployments/runtime-logs"
        )
    ),
  },
  {
    path: "/analytics",
    element: Async(
      () => import("~/pages/apps/[id]/environments/[env-id]/analytics")
    ),
  },
];

export default routes;
