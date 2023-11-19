import React, { useState, useContext } from "react";
import { AuthContext } from "~/pages/auth/Auth.context";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Speed from "@mui/icons-material/Speed";
import Logo from "~/components/Logo";
import UserButtons from "./UserButtons";

interface Props {
  children?: React.ReactNode;
  submenu?: React.ReactNode;
  app?: App;
}

const isLocal = process.env.STORMKIT_ENV == "local";

export default function TopMenu({ children, submenu, app }: Props) {
  const { user } = useContext(AuthContext);
  const [isCanary, setIsCanary] = useState(!!localStorage.getItem("sk_canary"));
  const shouldShowEnvButton = isLocal || user?.isAdmin;
  const userPackage = user?.package?.id || "free";

  return (
    <Box
      sx={{
        width: "100%",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
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
          <Link href="/">
            <Logo iconSize={100} />
          </Link>
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
              sx={{ color: "white", fontSize: 12, opacity: 0.5 }}
            >
              {isCanary ? "Canary" : isLocal ? "Local" : "Prod"}
            </Button>
          )}
        </Box>
        <Box sx={{ flex: 1 }}>{children}</Box>
        {userPackage === "free" && user?.isPaymentRequired !== true && (
          <Link href="/user/account">
            <Chip
              color="warning"
              component="span"
              label="Free trial"
              sx={{
                cursor: "pointer",
                ":hover": { opacity: 1 },
                opacity: 0.9,
              }}
            ></Chip>
          </Link>
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
