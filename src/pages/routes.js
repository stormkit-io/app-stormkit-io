import Async from "~/components/Async";
import Spinner from "~/components/Spinner";

Async.configure({ Loader: Spinner, props: { pageCenter: true } });

export default [
  {
    path: "/",
    exact: true,
    component: Async(() => import("~/pages/apps"))
  },
  {
    path: "/auth",
    component: Async(() => import("~/pages/auth"))
  },
  {
    path: "/logout",
    component: Async(() => import("~/pages/logout"))
  },
  {
    path: "/apps/new",
    exact: true,
    component: Async(() => import("~/pages/apps/new"))
  },
  {
    path: "/apps/new/:provider",
    exact: true,
    component: Async(() => import("~/pages/apps/new/[provider]"))
  },
  {
    path: "/app/:id",
    exact: true,
    component: Async(() => import("~/pages/app/[id]"))
  },
  {
    path: "/apps/:id",
    component: Async(() => import("~/pages/apps/Apps.context"))
  }
];
