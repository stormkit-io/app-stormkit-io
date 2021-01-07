import React, { ReactElement, FC } from "react";
import { Switch, Route } from "react-router-dom";
import MenuLayout from "~/layouts/MenuLayout";
import UserMenuGrill from "~/layouts/_components/UserMenu";
import UserMenu from "./_components/UserMenu";
import routes from "./routes";

const User: FC = (): ReactElement => (
  <MenuLayout menu={<UserMenu />}>
    <header className="flex flex-grow-0 max-w-screen-lg w-full m-auto py-6 items-center justify-end relative">
      <UserMenuGrill />
    </header>
    <div className="flex flex-auto max-w-screen-lg m-auto w-full mt-6">
      <Switch>
        {routes.map(route => (
          <Route {...route} key={route.path} />
        ))}
      </Switch>
    </div>
  </MenuLayout>
);

export default User;
