import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Button from "@mui/material/Button";
import AltRoute from "@mui/icons-material/AltRoute";
import CircularProgress from "@mui/material/CircularProgress";
import Dot from "~/components/Dot";
import Card from "~/components/Card";
import CardRow from "~/components/CardRow";
import CardHeader from "~/components/CardHeader";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { envMenuItems } from "~/layouts/AppLayout/menu_items";
import { timeSince } from "~/utils/helpers/date";
import EnvironmentFormModal from "./_components/EnvironmentFormModal";
import EnvironmentStatus from "./_components/EnvironmentStatus";

const endpoint = (env: Environment): string => {
  return env?.preview || "";
};

const isDeploying = (env: Environment): boolean => {
  return Boolean(env.lastDeploy && typeof env.lastDeploy.exit === "undefined");
};

export default function Environments() {
  const { app, environments } = useContext(AppContext);
  const [isModalOpen, toggleModal] = useState(false);
  const { pathname } = useLocation();

  return (
    <>
      <Card contentPadding={false}>
        <CardHeader
          title="Environments"
          subtitle=""
          actions={
            <Box sx={{ textAlign: "right" }}>
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
          }
        />
        {environments.map(env => (
          <CardRow
            key={env.id}
            menuItems={envMenuItems({ app, env, pathname }).map(i => ({
              text: i.text,
              href: i.path,
              icon: i.icon,
            }))}
            sx={{ alignItems: "baseline" }}
          >
            <Button
              variant="text"
              color="info"
              href={`/apps/${app.id}/environments/${env.id}`}
              sx={{
                position: "relative",
                ml: -0.75,
                textTransform: "capitalize",
              }}
            >
              {env.name}
              <ArrowForward sx={{ fontSize: 16, ml: 1 }} />
            </Button>
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                mt: 0.25,
                color: "text.secondary",
              }}
            >
              <AltRoute sx={{ fontSize: 11, mr: 0.5 }} />
              {env.branch}
              <Dot />
              <Link href={endpoint(env)} sx={{ color: "text.secondary" }}>
                {endpoint(env).replace(/https?:\/\//, "")}
              </Link>
              <Dot />
              <EnvironmentStatus env={env} app={app} />
            </Typography>
            <Box sx={{ mt: 1, color: "text.secondary" }}>
              <Typography
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                {isDeploying(env) ? (
                  <>
                    Deployment in progress
                    <CircularProgress
                      size={12}
                      color="error"
                      variant="indeterminate"
                      sx={{
                        fontSize: 12,
                        position: "relative",
                        ml: 1,
                      }}
                    />
                  </>
                ) : env.lastDeploy ? (
                  <>
                    Last deployed {timeSince(env.lastDeploy.createdAt * 1000)}{" "}
                    ago
                  </>
                ) : (
                  <>Not yet deployed</>
                )}
              </Typography>
            </Box>
          </CardRow>
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
      </Card>
    </>
  );
}
