import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import TabCustomStorage from "./_components/TabCustomStorage";
import TabDomainConfig from "./_components/TabDomainConfig/TabDomainConfig";
import TabConfigEnvVars from "./_components/TabConfigEnvVars";
import TabConfigGeneral from "./_components/TabConfigGeneral";
import TabConfigBuild from "./_components/TabConfigBuild";
import TabConfigHeaders from "./_components/TabConfigHeaders";
import TabConfigRedirects from "./_components/TabConfigRedirects";
import TabConfigServerless from "./_components/TabConfigServerless";
import TabConfigPrerender from "./_components/TabConfigPrerender";
import TabAPIKey from "./_components/TabAPIKey";
import { grey } from "@mui/material/colors";

const listItems = [
  { path: "#general", text: "General" },
  { path: "#build", text: "Build" },
  { path: "#serverless", text: "Serverless" },
  { path: "#headers", text: "Headers" },
  { path: "#redirects", text: "Redirects" },
  { path: "#env-vars", text: "Environment variables" },
  { path: "#api-keys", text: "API Keys" },
];

interface TabProps {
  app: App;
  environment: Environment;
  setRefreshToken: (v: number) => void;
}

export default function EnvironmentConfig() {
  const [selectedItem, setSelectedItem] = useState<string>("");
  const { app, setRefreshToken } = useContext(AppContext);
  const { environment } = useContext(EnvironmentContext);
  const { hash } = useLocation();
  const navigate = useNavigate();

  const prerendering = environment?.build.vars?.["SK_PRERENDER"] === "true";

  if (prerendering && listItems[6].path !== "#prerender") {
    listItems.splice(6, 0, { path: "#prerender", text: "Prerender" });
  }

  const Tab = useMemo(() => {
    switch (hash) {
      case "#domains":
        return TabDomainConfig;
      case "#storage":
        return TabCustomStorage;
      default:
        return ({ app, environment, setRefreshToken }: TabProps) => (
          <>
            <TabConfigGeneral
              app={app}
              environment={environment}
              setRefreshToken={setRefreshToken}
            />
            <TabConfigBuild
              app={app}
              environment={environment}
              setRefreshToken={setRefreshToken}
            />
            <TabConfigServerless
              app={app}
              environment={environment}
              setRefreshToken={setRefreshToken}
            />
            <TabConfigHeaders
              app={app}
              environment={environment}
              setRefreshToken={setRefreshToken}
            />
            <TabConfigRedirects
              app={app}
              environment={environment}
              setRefreshToken={setRefreshToken}
            />
            <TabConfigEnvVars
              app={app}
              environment={environment}
              setRefreshToken={setRefreshToken}
            />
            {prerendering && (
              <TabConfigPrerender
                app={app}
                environment={environment}
                setRefreshToken={setRefreshToken}
              />
            )}
            <TabAPIKey
              app={app}
              environment={environment}
              setRefreshToken={setRefreshToken}
            />
          </>
        );
    }
  }, [hash]);

  useEffect(() => {
    if (selectedItem) {
      document
        ?.querySelector(selectedItem)
        ?.scrollIntoView?.({ behavior: "smooth" });
    }
  }, [selectedItem]);

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
      <Box component="nav" sx={{ mr: 2, minWidth: "250px" }}>
        <List
          sx={{ position: "sticky", top: 0 }}
          data-testid="env-config-nav"
          data-selected={selectedItem}
        >
          <ListItem
            sx={{
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              flexDirection: "column",
              alignItems: "flex-start",
              px: 0,
            }}
          >
            <Typography
              component="span"
              sx={{
                display: "inline-block",
                mx: 2,
                width: "100%",
                color: grey[500],
              }}
            >
              Settings
            </Typography>
            <List
              sx={{
                mt: 1,
                pb: 0,
                width: "100%",
                borderTop: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {listItems.map(li => (
                <ListItem sx={{ p: 0 }} key={li.path}>
                  <Link
                    href={li.path}
                    onClick={e => {
                      e.preventDefault();
                      navigate({ hash: "" });
                      setSelectedItem(li.path);
                    }}
                    sx={{
                      display: "block",
                      px: 2,
                      py: 1,
                      width: "100%",
                      "&:hover": { opacity: 1, bgcolor: "rgba(0,0,0,0.2)" },
                      color:
                        li.path === selectedItem || // If selected
                        (li.path === "#general" && !selectedItem && !hash) // or in it's default state
                          ? "white"
                          : grey[500],
                    }}
                  >
                    <Typography component="span">{li.text}</Typography>
                  </Link>
                </ListItem>
              ))}
            </List>
          </ListItem>
          <Box
            component="li"
            sx={{ p: 2, borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <Link
              href="#storage"
              onClick={() => {
                setSelectedItem("");
              }}
              sx={{
                color: "white",
                opacity: hash === "#storage" ? 1 : 0.5,
                "&:hover": { opacity: 1 },
              }}
            >
              <Typography component="span">Custom storage</Typography>
            </Link>
          </Box>
          <Box component="li" sx={{ p: 2 }}>
            <Link
              href="#domains"
              onClick={() => {
                setSelectedItem("");
              }}
              sx={{
                opacity: hash === "#domains" ? 1 : 0.5,
                "&:hover": { opacity: 1 },
              }}
            >
              <Typography component="span">Custom domains</Typography>
            </Link>
          </Box>
        </List>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Tab
          app={app}
          environment={environment}
          setRefreshToken={setRefreshToken}
        />
      </Box>
    </Box>
  );
}
