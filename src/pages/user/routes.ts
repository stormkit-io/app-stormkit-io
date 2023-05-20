import Async from "~/components/Async";
import { RouteProps } from "react-router-dom";

const routes: Array<RouteProps> = [
  {
    path: "/account",
    element: Async(() => import("~/pages/user/account")),
  },
  {
    path: "/account/payment",
    element: Async(() => import("~/pages/user/account/Payment")),
  },
];

export default routes;
