import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import EmptyPage from "~/components/EmptyPage";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import { deployNow } from "~/utils/helpers/deployments";
import { useFetchDeployments } from "./actions";
import Deployment from "~/shared/deployments/DeploymentRow";
import CardRow from "~/components/CardRow";

export default function Deployments() {
  const { app } = useContext(AppContext);
  const { environment } = useContext(EnvironmentContext);
  const [_, setRefreshToken] = useState<number>(0);
  const { deployments, loading, error } = useFetchDeployments({
    app,
    from: 0,
    filters: { envId: environment.id },
  });

  return (
    <Card
      maxWidth="lg"
      sx={{ width: "100%", color: "white" }}
      loading={loading}
      error={error}
      contentPadding={false}
    >
      <CardHeader
        title="My Deployments"
        subtitle="Display all of your deployments across Stormkit in a single view."
      />
      <Box>
        {deployments.map(deployment => (
          <Deployment
            key={deployment.id}
            deployment={deployment}
            setRefreshToken={setRefreshToken}
            withAppName
          />
        ))}
      </Box>
      {!loading && !error && !deployments.length && (
        <EmptyPage>
          It's quite empty in here. <br />
          <Link href="#" onClick={deployNow} sx={{ fontWeight: "bold" }}>
            Deploy now
          </Link>{" "}
          to start hosting your website.
        </EmptyPage>
      )}
    </Card>
  );
}
