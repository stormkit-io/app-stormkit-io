import { useContext, useMemo } from "react";
import { useLocation } from "react-router";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import TabCustomStorage from "./_components/TabCustomStorage";
import TabDomainConfig from "./_components/TabDomainConfig/TabDomainConfig";
import TabConfigEnvVars from "./_components/TabConfigEnvVars";
import TabConfigGeneral from "./_components/TabConfigGeneral";
import TabConfigBuild from "./_components/TabConfigBuild";

const listItems = [
  { path: "#general", text: "General" },
  { path: "#build", text: "Build" },
  { path: "#vars", text: "Environment variables" },
];

export default function EnvironmentConfig() {
  const { app, setRefreshToken } = useContext(AppContext);
  const { environment } = useContext(EnvironmentContext);
  const { hash } = useLocation();

  const Tab = useMemo(() => {
    switch (hash) {
      case "#general":
        return TabConfigGeneral;
      case "#build":
        return TabConfigBuild;
      case "#vars":
        return TabConfigEnvVars;
      case "#domain":
        return TabDomainConfig;
      default:
        return TabConfigGeneral;
    }
  }, [hash]);

  return (
    <Box
      bgcolor="container.paper"
      sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
    >
      <Box component="nav" sx={{ m: 2, mt: 0, minWidth: "250px" }}>
        <List>
          <ListItem
            sx={{
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              flexDirection: "column",
              alignItems: "flex-start",
              px: 0,
            }}
          >
            <Box
              component="span"
              sx={{
                display: "inline-block",
                mx: 2,
                width: "100%",
                opacity: 0.5,
                color: "white",
              }}
            >
              Settings
            </Box>
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
                    sx={{
                      display: "block",
                      px: 3,
                      py: 1,
                      width: "100%",
                      "&:hover": { opacity: 1, bgcolor: "rgba(0,0,0,0.2)" },
                      opacity:
                        hash === li.path || (!hash && li.path === "#general")
                          ? 1
                          : 0.5,
                    }}
                  >
                    {li.text}
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
              sx={{
                color: "white",
                opacity: hash === "#storage" ? 1 : 0.5,
                "&:hover": { opacity: 1 },
              }}
            >
              Custom storage
            </Link>
          </Box>
          <Box component="li" sx={{ p: 2 }}>
            <Link
              href="#domain"
              sx={{
                opacity: hash === "#domain" ? 1 : 0.5,
                "&:hover": { opacity: 1 },
              }}
            >
              Domain
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
