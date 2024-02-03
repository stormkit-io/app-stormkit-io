import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import RocketLaunch from "@mui/icons-material/RocketLaunch";
import OpenInNew from "@mui/icons-material/OpenInNew";
import VpnLock from "@mui/icons-material/VpnLock";
import cn from "classnames";
import Link from "@mui/material/Link";
import Button from "~/components/ButtonV2";
import { useFetchStatus } from "../actions";
import { deployNow } from "~/utils/helpers/deployments";

interface Props {
  env: Environment;
  app: App;
}

const EnvironmentStatus: React.FC<Props> = ({ env, app }) => {
  const endpoint = env.customStorage?.externalUrl || env?.preview || "";

  const { status } = useFetchStatus({
    environment: env,
    app,
    domain: endpoint,
  });

  if (env.published) {
    return (
      <>
        <Box sx={{ display: "flex" }}>
          <Box component="label" sx={{ width: 112, opacity: 0.5 }}>
            Endpoint
          </Box>
          <Box>
            <OpenInNew sx={{ fontSize: 16, mr: 1 }} />
            <Link href={endpoint} sx={{ color: "white" }}>
              {endpoint.replace(/https?:\/\//, "")}
            </Link>
          </Box>
        </Box>
        <Box sx={{ display: "flex", mt: 2 }}>
          <Box component="label" sx={{ width: 112, opacity: 0.5 }}>
            Published
          </Box>
          <Box>
            <RocketLaunch sx={{ fontSize: 16, mr: 1 }} />
            {env.published.map(p => (
              <Link
                key={p.deploymentId}
                href={`/apps/${env.appId}/environments/${env.id}/deployments/${p.deploymentId}`}
                sx={{ color: "white" }}
              >
                {p.deploymentId}
              </Link>
            ))}
          </Box>
        </Box>
        <Box sx={{ display: "flex", mt: 2 }}>
          <Box component="label" sx={{ width: 112, opacity: 0.5 }}>
            Status
          </Box>
          <Typography
            sx={{ color: status === 200 || status === 304 ? "green" : "white" }}
          >
            <VpnLock sx={{ fontSize: 16, mr: 1 }} />
            {status}
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography component="label" sx={{ opacity: 0.5, width: 112 }}>
        Status
      </Typography>
      <span
        className={cn("w-2 h-2 inline-block mr-4", {
          "bg-green-50": env.lastDeploy?.exit === 0,
          "bg-red-50": env.lastDeploy?.exit !== 0,
          "bg-yellow-50": !env.lastDeploy,
        })}
      />
      {env.lastDeploy?.createdAt ? (
        env.lastDeploy?.exit === 0 ? (
          <Typography>
            Deployed successfully.{" "}
            <Link
              href={`/apps/${app.id}/environments/${env.id}/deployments/${env.lastDeploy.id}`}
            >
              Go to deployment <span className="fa fa-chevron-right" />
            </Link>
          </Typography>
        ) : (
          "Deployment failed."
        )
      ) : (
        <Typography>
          Not yet deployed.{" "}
          <Button
            type="button"
            styled={false}
            onClick={deployNow}
            onKeyUp={deployNow}
          >
            Deploy now
          </Button>{" "}
          and publish it to serve your application.
        </Typography>
      )}
    </Box>
  );
};

export default EnvironmentStatus;
