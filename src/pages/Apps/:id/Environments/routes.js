import Async from "~/components/Async";

export default [
  {
    path: "/apps/:id/environments",
    exact: true,
    component: Async(() => import("~/pages/Apps/:id/Environments")),
  },
  {
    path: "/apps/:id/environments/:envId",
    component: Async(() =>
      import("~/pages/Apps/:id/Environments/:envId/Environment.context")
    ),
  },
];
