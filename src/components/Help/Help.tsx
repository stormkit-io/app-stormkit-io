import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import QuestionMarkOutlined from "@mui/icons-material/HelpCenter";
import Drawer from "@mui/material/Drawer";
import { useState } from "react";
import Card from "../Card";
import CardHeader from "../CardHeader";
import { Typography } from "@mui/material";

interface Props {
  children: React.ReactNode;
  title?: string;
  subtitle?: React.ReactNode;
}

export default function Help({ children, title = "Help", subtitle }: Props) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <Button
        sx={{ display: "flex", alignItems: "center" }}
        onClick={() => setIsDrawerOpen(true)}
      >
        <QuestionMarkOutlined sx={{ mr: 1 }} />
        <Typography>Help</Typography>
      </Button>
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{ zIndex: 1600 }}
      >
        <Card sx={{ minHeight: "100vh", minWidth: "400px", maxWidth: "600px" }}>
          <CardHeader title={title} subtitle={subtitle} />
          <Box>{children}</Box>
        </Card>
      </Drawer>
    </>
  );
}
