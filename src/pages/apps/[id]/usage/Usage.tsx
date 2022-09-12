import React, { useContext } from "react";
import { Tooltip } from "@mui/material";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { AuthContext } from "~/pages/auth/Auth.context";
import InfoBox from "~/components/InfoBox";
import Spinner from "~/components/Spinner";
import UsageBar from "~/components/UsageBar";
import Link from "~/components/Link";
import { useFetchStats } from "./actions";

const Usage: React.FC = (): React.ReactElement => {
  const { app } = useContext(AppContext);
  const { user } = useContext(AuthContext);

  const { stats, error, loading } = useFetchStats({ app });

  if (error) {
    return (
      <div>
        <h1 className="mb-4 text-2xl text-white">Usage</h1>
        <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div>
        <h1 className="mb-4 text-2xl text-white">Usage</h1>
        <Spinner primary />
      </div>
    );
  }

  const totalDeployments =
    stats.numberOfDeploymentsThisMonth + stats.remainingDeploymentsThisMonth;

  return (
    <div className="w-full">
      <h1 className="mb-4 text-2xl text-white flex justify-between">
        <div>Usage</div>
        {user!.package.id !== "enterprise" ? (
          <Link to="/user/account" className="text-sm self-end">
            Upgrade account
            <span className="fas fa-arrow-right ml-2 inline-block" />
          </Link>
        ) : (
          ""
        )}
      </h1>
      <div className="rounded bg-white p-8 mb-8">
        <div className="flex justify-between text-sm">
          <div>
            Number of Deployments
            <Tooltip
              title={
                "Remaining deployments for the rest of this month. " +
                "This number is calculated by summing deployments across all " +
                "applications owned by the application owner. It resets on the " +
                "first day of every month."
              }
              arrow
              className="text-black ml-1"
            >
              <span className="fas fa-question-circle" />
            </Tooltip>
          </div>
          <div className="font-bold">
            ({stats.numberOfDeploymentsThisMonth} / {totalDeployments})
          </div>
        </div>
        <UsageBar
          className="mt-2"
          used={stats.numberOfDeploymentsThisMonth}
          total={totalDeployments}
        />
      </div>
    </div>
  );
};

export default Usage;
