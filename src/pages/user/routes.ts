import Async from "~/components/Async";
import { RouteProps } from "react-router-dom";

const routes: Array<RouteProps> = [
  {
    path: "/account",
    element: Async(() => import("~/pages/user/account")),
  },
];

export default routes;
