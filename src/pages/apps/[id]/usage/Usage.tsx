import React, { useContext } from "react";
import { Tooltip } from "@mui/material";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { AuthContext } from "~/pages/auth/Auth.context";
import Container from "~/components/Container";
import InfoBox from "~/components/InfoBoxV2";
import Spinner from "~/components/Spinner";
import UsageBar from "~/components/UsageBar";
import Button from "~/components/ButtonV2";
import { useFetchStats } from "./actions";

const Usage: React.FC = (): React.ReactElement => {
  const { app } = useContext(AppContext);
  const { user } = useContext(AuthContext);

  const { stats, error, loading } = useFetchStats({ app });

  const totalDeployments = stats
    ? stats.numberOfDeploymentsThisMonth + stats.remainingDeploymentsThisMonth
    : 0;

  return (
    <Container
      maxWidth="max-w-none"
      className="pb-4"
      title="Usage"
      actions={
        user!.package.id !== "enterprise" ? (
          <Button href="/user/account">
            Upgrade account
            <span className="fas fa-arrow-right ml-2 inline-block" />
          </Button>
        ) : (
          ""
        )
      }
    >
      {loading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
      {!loading && error && (
        <InfoBox type={InfoBox.ERROR} className="mx-4">
          {error}
        </InfoBox>
      )}
      {!loading && !error && (
        <div className="flex flex-col text-sm p-4 bg-blue-10 mx-4">
          <div className="flex justify-between itesm-center mb-4">
            <div className="flex items-center">
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
            </div>
            <div className="font-bold">
              ({stats?.numberOfDeploymentsThisMonth} / {totalDeployments})
            </div>
          </div>
          {stats && (
            <UsageBar
              className="mt-2"
              used={stats.numberOfDeploymentsThisMonth}
              total={totalDeployments}
            />
          )}
        </div>
      )}
    </Container>
  );
};

export default Usage;
