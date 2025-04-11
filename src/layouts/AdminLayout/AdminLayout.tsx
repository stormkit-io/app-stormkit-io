import React, { useContext } from "react";
import Box from "@mui/material/Box";
import { useLocation } from "react-router";
import { AuthContext } from "~/pages/auth/Auth.context";
import Error404 from "~/components/Errors/Error404";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import { useSelectedTeam } from "../TopMenu/Teams/actions";
import TopMenu from "../TopMenu";
import MenuLink from "~/components/MenuLink";

interface Props {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const { user, teams } = useContext(AuthContext);
  const selectedTeam = useSelectedTeam({ teams });
  const { pathname } = useLocation();

  if (!user?.isAdmin) {
    return <Error404 />;
  }

  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      {user && (
        <Box
          bgcolor="background.paper"
          sx={{
            display: "flex",
            position: "sticky",
            top: 0,
            zIndex: 50,
            boxShadow: 2,
          }}
        >
          <TopMenu team={selectedTeam} />
        </Box>
      )}
      <Box
        sx={{
          mt: 2,
          flex: 1,
          px: { xs: 2, md: 0 },
          display: "flex",
          alignItems: user ? "flex-start" : "center",
          justifyContent: "center",
        }}
      >
        <Box maxWidth="lg" sx={{ flex: 1, height: "100%", pb: 2 }}>
          <Card sx={{ height: "100%" }}>
            <CardHeader
              title="Admin"
              subtitle="Dashboard to manage Stormkit Instance"
            />
            <Box sx={{ mb: 4 }}>
              <MenuLink
                item={{
                  path: "/admin/subscription",
                  text: "Subscription",
                  isActive: pathname.includes("/admin/subscription"),
                }}
              />
              <MenuLink
                item={{
                  path: "/admin/jobs",
                  text: "Jobs",
                  isActive: pathname.includes("/admin/jobs"),
                }}
              />
            </Box>
            {children}
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
