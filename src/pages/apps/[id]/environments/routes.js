import Async from "~/components/Async";

export default [
  {
    path: "/apps/:id/environments",
    exact: true,
    component: Async(() => import("~/pages/apps/[id]/environments"))
  },
  {
    path: "/apps/:id/environments/:envId",
    component: Async(() =>
      import("~/pages/apps/[id]/environments/[env-id]/Environment.context")
    )
  }
];
