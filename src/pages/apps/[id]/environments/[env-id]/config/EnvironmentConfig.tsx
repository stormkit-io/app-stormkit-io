import { useContext, useMemo } from "react";
import { useLocation } from "react-router";
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
import TabAPIKey from "./_components/TabAPIKey";
import { grey } from "@mui/material/colors";

const listItems = [
  { path: "#general", text: "General" },
  { path: "#build", text: "Build" },
  { path: "#vars", text: "Environment variables" },
  { path: "#api", text: "API Keys" },
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
      case "#api":
        return TabAPIKey;
      case "#domain":
        return TabDomainConfig;
      case "#storage":
        return TabCustomStorage;
      default:
        return TabConfigGeneral;
    }
  }, [hash]);

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
      <Box component="nav" sx={{ mr: 2, minWidth: "250px" }}>
        <List>
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
                    sx={{
                      display: "block",
                      px: 2,
                      py: 1,
                      width: "100%",
                      "&:hover": { opacity: 1, bgcolor: "rgba(0,0,0,0.2)" },
                      color:
                        hash === li.path || (!hash && li.path === "#general")
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
              href="#domain"
              sx={{
                opacity: hash === "#domain" ? 1 : 0.5,
                "&:hover": { opacity: 1 },
              }}
            >
              <Typography component="span">Domain</Typography>
            </Link>
          </Box>
        </List>
      </Box>
      <Box sx={{ flex: 1, bgcolor: "container.paper" }}>
        <Tab
          app={app}
          environment={environment}
          setRefreshToken={setRefreshToken}
        />
      </Box>
    </Box>
  );
}
