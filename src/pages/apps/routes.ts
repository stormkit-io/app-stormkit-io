import Async from "~/components/Async";
import { RouteProps } from "react-router-dom";

const routes: Array<RouteProps> = [
  {
    path: "/",
    element: Async(() => import("~/pages/apps/[id]")),
  },
  {
    path: "/environments/:envId/*",
    element: Async(() => import("~/pages/apps/[id]/environments/[env-id]")),
  },
  {
    path: "/environments",
    element: Async(() => import("~/pages/apps/[id]/environments/Environments")),
  },
  {
    path: "/deployments",
    element: Async(() => import("~/pages/apps/[id]/deployments")),
  },
  {
    path: "/deployments/:deploymentId",
    element: Async(
      () => import("~/pages/apps/[id]/deployments/[deployment-id]")
    ),
  },
  {
    path: "/team",
    element: Async(() => import("~/pages/apps/[id]/team")),
  },
  {
    path: "/settings",
    element: Async(() => import("~/pages/apps/[id]/settings")),
  },
  {
    path: "/usage",
    element: Async(() => import("~/pages/apps/[id]/usage")),
  },
];

export default routes;
