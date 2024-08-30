import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import TabDomainConfig from "./_components/TabDomainConfig/TabDomainConfig";
import TabConfigEnvVars from "./_components/TabConfigEnvVars";
import TabConfigGeneral from "./_components/TabConfigGeneral";
import TabConfigBuild from "./_components/TabConfigBuild";
import TabConfigHeaders from "./_components/TabConfigHeaders";
import TabConfigRedirects from "./_components/TabConfigRedirects";
import TabConfigServerless from "./_components/TabConfigServerless";
import TabConfigPrerender from "./_components/TabConfigPrerender";
import TabAPIKey from "./_components/TabAPIKey";

interface NavItem {
  path: string;
  text: string;
}

interface NavItemParent {
  title: string;
  children: NavItem[];
}

const listItems: NavItemParent[] = [
  {
    title: "Settings",
    children: [
      { path: "#general", text: "General" },
      { path: "#build", text: "Build" },
      { path: "#serverless", text: "Serverless" },
      { path: "#headers", text: "Headers" },
      { path: "#redirects", text: "Redirects" },
      { path: "#env-vars", text: "Environment variables" },
      { path: "#api-keys", text: "API Keys" },
    ],
  },
  { title: "", children: [{ path: "#domains", text: "Custom domains" }] },
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

  if (prerendering && listItems[0]?.children[6]?.path !== "#prerender") {
    listItems[0].children.splice(6, 0, {
      path: "#prerender",
      text: "Prerender",
    });
  }

  const Tab = useMemo(() => {
    switch (hash) {
      case "#domains":
        return TabDomainConfig;
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
  }, [hash, environment?.id]);

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
          sx={{ position: "sticky", top: 0, py: 0 }}
          data-testid="env-config-nav"
          data-selected={selectedItem}
        >
          <ListItem
            sx={{
              flexDirection: "column",
              alignItems: "flex-start",
              py: 0,
            }}
          >
            <List
              sx={{
                py: 0,
                width: "100%",
              }}
            >
              {listItems.map(item => (
                <Box key={item.title}>
                  <Typography
                    sx={{
                      px: 1,
                      py: 1,
                      mb: 2,
                      display: "block",
                      borderBottom: "1px solid",
                      borderColor: "container.transparent",
                    }}
                    component="span"
                  >
                    {item.title}
                  </Typography>
                  {item.children.map(li => (
                    <ListItem sx={{ p: 0 }} key={li.path}>
                      <Link
                        href={li.path}
                        onClick={e => {
                          e.preventDefault();
                          navigate({ hash: li.path });
                          setSelectedItem(li.path);
                        }}
                        sx={{
                          display: "block",
                          px: 2,
                          py: 1,
                          width: "100%",
                          "&:hover": { bgcolor: "container.paper" },
                          borderRadius: 1,
                          bgcolor:
                            li.path === selectedItem || // If selected
                            li.path === hash ||
                            (li.path === "#general" && !selectedItem && !hash) // or in it's default state
                              ? "container.default"
                              : "",
                        }}
                      >
                        <Typography component="span">{li.text}</Typography>
                      </Link>
                    </ListItem>
                  ))}
                </Box>
              ))}
            </List>
          </ListItem>
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
