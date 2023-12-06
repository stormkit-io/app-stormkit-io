import React, { useContext, useState } from "react";
import { useLocation } from "react-router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import ArrowForward from "@mui/icons-material/ArrowForward";
import CallSplit from "@mui/icons-material/CallSplit";
import Button from "@mui/material/Button";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { envMenuItems } from "~/layouts/AppLayout/menu_items";
import DotDotDot from "~/components/DotDotDotV2";
import EnvironmentFormModal from "./_components/EnvironmentFormModal";
import EnvironmentStatus from "./_components/EnvironmentStatus";

const Environments: React.FC = (): React.ReactElement => {
  const { app, environments } = useContext(AppContext);
  const [isModalOpen, toggleModal] = useState(false);
  const { pathname } = useLocation();

  return (
    <Box>
      <Box sx={{ textAlign: "right", mb: 2 }}>
        <Button
          onClick={() => toggleModal(true)}
          variant="contained"
          color="secondary"
          aria-label="Open create environment modal"
          sx={{ textTransform: "capitalize" }}
        >
          New environment
        </Button>
      </Box>
      {environments.map(env => (
        <Card
          key={env.id}
          sx={{
            mb: 2,
            color: "white",
            "&:last-child": { mb: 0 },
            "&:hover": {
              transition: "all 0.25s ease-in",
            },
          }}
        >
          <CardHeader
            // This is to fix the extra space created by the padding of the Env Name Button.
            sx={{ position: "relative", mt: -1 }}
            actions={
              <DotDotDot
                items={envMenuItems({ app, env, pathname }).map(i => ({
                  text: i.text,
                  href: i.path,
                  icon: i.icon,
                }))}
              />
            }
          >
            <Typography variant="h2" sx={{ position: "relative", ml: -1 }}>
              <Link href={`/apps/${app.id}/environments/${env.id}`}>
                <Button
                  variant="text"
                  color="info"
                  sx={{
                    color: "white",
                    textTransform: "capitalize",
                    fontSize: 20,
                  }}
                >
                  {env.name}
                  <ArrowForward sx={{ fontSize: 16, ml: 1 }} />
                </Button>
              </Link>
            </Typography>
          </CardHeader>
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Box component="label" sx={{ width: 112, opacity: 0.5 }}>
              Branch
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CallSplit sx={{ mr: 1, fontSize: 16 }} />
              <Typography>{env.branch}</Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <EnvironmentStatus env={env} app={app} />
          </Box>
        </Card>
      ))}
      {isModalOpen && (
        <EnvironmentFormModal
          app={app}
          isOpen={isModalOpen}
          onClose={() => {
            toggleModal(false);
          }}
        />
      )}
    </Box>
  );
};

export default Environments;
