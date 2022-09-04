import React from "react";
import { Routes, Route } from "react-router";
import EnvironmentMenu from "./_components/EnvironmentMenu";
import routes from "./routes";
import EnvironmentContextProvider from "../Environment.context";

const EnvironmentsEntry = () => {
  return (
    <EnvironmentContextProvider>
      <div className="flex flex-col w-full">
        <EnvironmentMenu />
        <div className="mb-4">
          <Routes>
            {routes.map(route => (
              <Route {...route} path={route.path} key={route.path} />
            ))}
          </Routes>
        </div>
      </div>
    </EnvironmentContextProvider>
  );
};

export default EnvironmentsEntry;
