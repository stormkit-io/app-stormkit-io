import Async from "~/components/Async";
import { RouteProps } from "react-router-dom";

const routes: Array<RouteProps> = [
  {
    path: "/apps/:id/environments",
    exact: true,
    component: Async(() => import("~/pages/apps/[id]/environments")),
  },
  {
    path: "/apps/:id/environments/:envId",
    component: Async(
      () =>
        import("~/pages/apps/[id]/environments/[env-id]/Environment.context")
    ),
  },
];

export default routes;
