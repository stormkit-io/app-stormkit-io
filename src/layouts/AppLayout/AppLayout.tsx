import React, { useContext, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Route, Routes } from "react-router-dom";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Menu from "@mui/icons-material/Menu";
import Close from "@mui/icons-material/Close";
import AppContextProvider, { AppContext } from "~/pages/apps/[id]/App.context";
import AppName from "~/components/AppName";
import TopMenu from "~/components/TopMenu";
import DeployButton from "./_components/DeployButton";
import { appMenuItems, envMenuItems } from "./menu_items";
import { routes } from "./routes";

export const AppLayout: React.FC = () => {
  const { app, environments } = useContext(AppContext);
  const { pathname } = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  // Deduce the envId from the pathname because we cannot access
  // the :envId url parameter, as it's included inside
  // this component as a child.
  const envId = pathname.split("/environments/")?.[1]?.split("/")?.[0];
  const env = environments.find(e => e.id === envId)!;
  const selectedEnvId = envId || "";

  const appMenu = useMemo(
    () => appMenuItems({ app, pathname }),
    [app, pathname]
  );

  const envMenu = useMemo(
    () => envMenuItems({ app, env, pathname }),
    [app, env, pathname]
  );

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
      <Box sx={{ display: { xs: "xs", md: "block" }, width: "100%" }}>
        <TopMenu app={app} />
      </Box>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "100%",
        }}
      >
        <Box
          component="header"
          sx={{
            bgcolor: { xs: "background.paper", md: "rgba(0,0,0,0.15)" },
            color: "white",
            display: { xs: showMobileMenu ? "flex" : "none", md: "flex" },
            flexDirection: "column",
            maxWidth: { xs: "none", md: "16rem" },
            width: "100%",
            position: { xs: "fixed", md: "static" },
            left: { xs: 0, md: "auto" },
            right: { xs: 0, md: "auto" },
            bottom: { xs: 0, md: "auto" },
            top: { xs: 57, md: "auto" },
            zIndex: 100,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              fontWeight: "bold",
              fontSize: 12,
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "white",
              px: 2,
              py: 1,
            }}
          >
            <Box component="div">
              <IconButton href={`/`} sx={{ mr: 1 }}>
                <ArrowBack />
              </IconButton>
              App
            </Box>
            <IconButton
              onClick={() => {
                setShowMobileMenu(false);
              }}
              sx={{ display: { xs: "inline-block", md: "none" } }}
            >
              <Close />
            </IconButton>
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            {appMenu.map(item => (
              <Link
                key={item.path}
                href={item.path}
                sx={{
                  cursor: "pointer",
                  bgcolor: item.isActive ? "rgba(0,0,0,0.3)" : undefined,
                  color: "white",
                  px: 2,
                  py: 0.5,
                  mr: 4,
                  width: "100%",
                  opacity: item.isActive ? 1 : 0.5,
                  ":hover": { opacity: 1, color: "white" },
                }}
                onClick={() => {
                  setShowMobileMenu(false);
                }}
              >
                <Box
                  component="span"
                  display="inline-block"
                  sx={{ mr: 1, scale: "0.75" }}
                >
                  <IconButton>{item.icon}</IconButton>
                </Box>
                {item.text}
              </Link>
            ))}
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              variant="h2"
              sx={{
                borderTop: "1px solid rgba(255,255,255,0.1)",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                fontWeight: "bold",
                fontSize: 12,
                textTransform: "uppercase",
                display: "flex",
                alignItems: "center",
                color: "white",
                px: 2,
                py: 1,
              }}
            >
              <IconButton href={`/apps/${app.id}/environments`} sx={{ mr: 1 }}>
                <ArrowBack />
              </IconButton>
              Environment
            </Typography>

            <Box
              sx={{
                borderBottom: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <Select
                variant="standard"
                disableUnderline
                onChange={e => {
                  if (pathname.includes(`/environments/${selectedEnvId}`)) {
                    navigate(
                      pathname.replace(
                        `/environments/${selectedEnvId}`,
                        `/environments/${e.target.value}`
                      )
                    );
                  } else {
                    navigate(`/apps/${app.id}/environments/${e.target.value}`);
                  }
                }}
                sx={{ pl: 4, pr: 1, py: 2 }}
                value={selectedEnvId || "_"}
              >
                <MenuItem value="_" disabled>
                  Select an environment
                </MenuItem>
                {environments.map(e => (
                  <MenuItem key={e.id} value={e.id}>
                    {e.env}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            {env &&
              envMenu.map(item => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => {
                    setShowMobileMenu(false);
                  }}
                  sx={{
                    cursor: "pointer",
                    bgcolor: item.isActive ? "rgba(0,0,0,0.3)" : undefined,
                    color: "white",
                    px: 2,
                    py: 0.5,
                    mr: 4,
                    width: "100%",
                    opacity: item.isActive ? 1 : 0.5,
                    ":hover": { opacity: 1, color: "white" },
                  }}
                >
                  <Box
                    component="span"
                    display="inline-block"
                    sx={{ mr: 1, scale: "0.75" }}
                  >
                    <IconButton>{item.icon}</IconButton>
                  </Box>
                  {item.text}
                </Link>
              ))}
          </Box>
        </Box>
        <Box
          component="section"
          sx={{
            flex: 1,
            mx: "auto",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            maxWidth: "768px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              my: 2,
              px: { xs: 2, md: 0 },
            }}
          >
            <AppName app={app} imageWidth={7} withLinkToRepo />
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <DeployButton
                app={app}
                environments={environments}
                selectedEnvId={selectedEnvId}
              />
              <IconButton
                sx={{ display: { md: "none" }, pl: 2 }}
                onClick={() => {
                  setShowMobileMenu(true);
                }}
              >
                <Menu />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ px: { xs: 2, md: 0 }, width: "100%" }}>
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
