import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import Box from "@mui/material/Box";
import AppContextProvider, { AppContext } from "~/pages/apps/[id]/App.context";
import TopMenu from "../TopMenu";
import AppMenu from "./AppMenu";
import EnvMenu from "./EnvMenu";
import { routes } from "./routes";

export const AppLayout: React.FC = () => {
  const { app, environments } = useContext(AppContext);

  if (environments.length === 0) {
    return <></>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <TopMenu app={app} submenu={<AppMenu app={app} />} />
      <Box
        sx={{
          display: "flex",
          width: "100%",
        }}
      >
        <Box
          component="section"
          sx={{
            flex: 1,
            mx: "auto",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            maxWidth: "1024px",
            my: 2,
          }}
        >
          <EnvMenu />
          <Box sx={{ width: "100%" }}>
            <Routes>
              {routes.map(r => (
                <Route {...r} key={r.path} />
              ))}
            </Routes>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const WithAppProvider: React.FC = () => (
  <AppContextProvider>
    <AppLayout />
  </AppContextProvider>
);

export default WithAppProvider;
