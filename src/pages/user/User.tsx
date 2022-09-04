import React from "react";
import { Routes, Route } from "react-router-dom";
import MenuLayout from "~/layouts/MenuLayout";
import UserMenuGrill from "~/layouts/_components/UserMenu";
import UserMenu from "./_components/UserMenu";
import routes from "./routes";

const User: React.FC = () => (
  <MenuLayout menu={<UserMenu />}>
    <header className="flex flex-grow-0 max-w-screen-lg w-full m-auto py-6 items-center justify-end relative">
      <UserMenuGrill />
    </header>
    <div className="flex flex-auto max-w-screen-lg m-auto w-full mt-6">
      <Routes>
        {routes.map(route => (
          <Route
            {...route}
            key={Array.isArray(route.path) ? route.path[0] : route.path}
          />
        ))}
      </Routes>
    </div>
  </MenuLayout>
);

export default User;
