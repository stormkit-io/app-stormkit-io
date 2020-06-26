import Async from "~/components/Async";

export default [
  {
    path: "/apps/:id",
    exact: true,
    component: Async(() => import("~/pages/Apps/:id")),
  },
  {
    path: "/apps/:id/environments",
    component: Async(() =>
      import("~/pages/Apps/:id/Environments/Environments.context")
    ),
  },
  {
    path: "/apps/:id/deployments",
    exact: true,
    component: Async(() => import("~/pages/Apps/:id/Deployments")),
  },
];
