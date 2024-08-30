import React, { useContext } from "react";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import EastIcon from "@mui/icons-material/East";
import Typography from "@mui/material/Typography";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { AuthContext } from "~/pages/auth/Auth.context";
import Card from "~/components/Card";
import CardRow from "~/components/CardRow";
import CardHeader from "~/components/CardHeader";
import UsageBar from "~/components/UsageBar";
import { useFetchStats } from "./actions";

const Usage: React.FC = (): React.ReactElement => {
  const { app } = useContext(AppContext);
  const { user } = useContext(AuthContext);

  const { stats, error, loading } = useFetchStats({ app });

  const totalDeployments = stats
    ? stats.numberOfDeploymentsThisMonth + stats.remainingDeploymentsThisMonth
    : 0;

  const upgradeable =
    user!.package.id !== "enterprise" && user!.package.id !== "self-hosted";

  return (
    <Card
      sx={{ width: "100%" }}
      loading={loading}
      error={error}
      contentPadding={false}
    >
      <CardHeader
        title="Usage"
        subtitle="Track your Stormkit usage under this dashboard."
        actions={
          upgradeable ? (
            <Button variant="contained" color="secondary" href="/user/account">
              Upgrade account
              <EastIcon sx={{ ml: 1 }} />
            </Button>
          ) : (
            ""
          )
        }
      />
      <CardRow>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 2,
            mt: 2,
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center" }}
            className="flex items-center"
          >
            Number of Deployments
            <Tooltip
              title={
                "Remaining deployments for the rest of this month. " +
                "This number is calculated by summing deployments across all " +
                "applications owned by the application owner. It resets on the " +
                "first day of every month."
              }
              arrow
              className="ml-2"
            >
              <span className="fas fa-question-circle text-gray-80 text-lg" />
            </Tooltip>
          </Box>
          <Typography sx={{ fontWeight: "bold" }}>
            ({stats?.numberOfDeploymentsThisMonth} / {totalDeployments})
          </Typography>
        </Box>
        {stats && (
          <UsageBar
            used={stats.numberOfDeploymentsThisMonth}
            total={totalDeployments}
          />
        )}
      </CardRow>
    </Card>
  );
};

export default Usage;
