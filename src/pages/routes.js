import Async from "~/components/Async";
import Spinner from "~/components/Spinner";

Async.configure({ Loader: Spinner, props: { pageCenter: true } });

export default [
  {
    path: "/",
    exact: true,
    component: Async(() => import("~/pages/Home")),
  },
  {
    path: "/auth",
    component: Async(() => import("~/pages/Auth")),
  },
];
