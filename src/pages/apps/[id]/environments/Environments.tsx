import React, { useContext, useState } from "react";
import { useLocation } from "react-router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
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
        <Box
          key={env.id}
          bgcolor="container.paper"
          sx={{
            mb: 2,
            p: 2,
            color: "white",
            "&:last-child": { mb: 0 },
            "&:hover": {
              transition: "all 0.25s ease-in",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Link
                href={`/apps/${app.id}/environments/${env.id}`}
                sx={{ color: "white", textTransform: "capitalize" }}
              >
                {env.name}
              </Link>
            </Box>
            <Box>
              <DotDotDot
                items={envMenuItems({ app, env, pathname }).map(i => ({
                  text: i.text,
                  href: i.path,
                  icon: i.icon,
                }))}
              />
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Box component="label" sx={{ width: 80, opacity: 0.5 }}>
              Branch
            </Box>
            <Box>
              <span className="fa fa-code-branch w-6 text-gray-50"></span>
              {env.branch}
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <EnvironmentStatus env={env} app={app} />
          </Box>
        </Box>
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
