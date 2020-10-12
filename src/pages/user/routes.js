import Async from "~/components/Async";

export default [
  {
    path: "/user/account",
    exact: true,
    component: Async(() => import("~/pages/user/account"))
  }
];
