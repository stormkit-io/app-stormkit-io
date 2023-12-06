import React, { useContext } from "react";
import Box from "@mui/material/Box";
import { AuthContext } from "~/pages/auth/Auth.context";
import TopMenu from "./TopMenu";

interface Props {
  children: React.ReactNode;
}

export default function CenterLayout({ children }: Props) {
  const { user } = useContext(AuthContext);

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
          <TopMenu />
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
        {children}
      </Box>
    </Box>
  );
}
