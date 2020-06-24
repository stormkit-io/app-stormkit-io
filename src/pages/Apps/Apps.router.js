import React from "react";
import { Switch, Route } from "react-router";
import Async from "~/components/Async";
import Spinner from "~/components/Spinner";
import AppLayout from "~/layouts/AppLayout";
import AppsContext from "./Apps.context";

Async.configure({ Loader: Spinner, props: { pageCenter: true } });

const routes = [
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

const AppRouter = () => {
  return (
    <AppsContext.Provider>
      <AppLayout>
        <Switch>
          {routes.map((route) => (
            <Route {...route} key={route.path} />
          ))}
        </Switch>
      </AppLayout>
    </AppsContext.Provider>
  );
};

export default AppRouter;
