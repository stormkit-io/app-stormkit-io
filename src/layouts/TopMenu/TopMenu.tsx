import React, { useState, useContext, useMemo } from "react";
import { AuthContext } from "~/pages/auth/Auth.context";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Speed from "@mui/icons-material/Speed";
import Logo from "~/components/Logo";
import UserButtons from "./UserButtons";
import TeamsToggle from "./Teams/TeamToggle";
import { grey } from "@mui/material/colors";

interface Props {
  children?: React.ReactNode;
  submenu?: React.ReactNode;
  team?: Team;
  app?: App;
}

const isLocal = process.env.NODE_ENV === "development";

export default function TopMenu({ children, submenu, app, team }: Props) {
  const slug = `/${team?.slug || ""}`;
  const { user } = useContext(AuthContext);
  const [isCanary, setIsCanary] = useState(!!localStorage.getItem("sk_canary"));
  const shouldShowEnvButton = useMemo(() => {
    return user?.isAdmin || isLocal;
  }, [user]);

  return (
    <Box
      sx={{
        width: "100%",
        borderBottom: `1px solid ${grey[900]}`,
      }}
    >
      <Box
        id="top-bar"
        bgcolor="background.paper"
        component="nav"
        sx={{
          display: "flex",
          alignItems: "center",
          boxShadow: 2,
          m: "auto",
          px: 2,
          py: 1,
          width: "100%",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Link href={slug} sx={{ flex: "1", mr: 1 }}>
            <Logo iconSize={28} iconOnly />
          </Link>
          <TeamsToggle app={app} />
        </Box>
        <Box sx={{ flex: 1 }}>{children}</Box>
        {shouldShowEnvButton && (
          <Button
            onClick={() => {
              if (!isCanary) {
                localStorage.setItem("sk_canary", "true");
                setIsCanary(true);
              } else {
                localStorage.removeItem("sk_canary");
                setIsCanary(false);
              }
            }}
            size="small"
            sx={{ color: grey[500], fontSize: 12 }}
          >
            {isCanary ? "Canary" : isLocal ? "Local" : "Prod"}
          </Button>
        )}
        {app && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              pr: 2,
              pl: 1.75,
              mr: 2,
              borderRight: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <Link
              href={`/apps/${app?.id}/usage`}
              sx={{
                color: "white",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <Speed sx={{ mr: 1 }} />
              Usage
            </Link>
          </Box>
        )}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <UserButtons />
        </Box>
      </Box>
      {submenu}
    </Box>
  );
}
