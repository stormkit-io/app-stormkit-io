import React from "react";
import { Routes, Route } from "react-router-dom";
import routes from "./routes";

const User: React.FC = () => (
  <Routes>
    {routes.map(route => (
      <Route
        {...route}
        key={Array.isArray(route.path) ? route.path[0] : route.path}
      />
    ))}
  </Routes>
);

export default User;
