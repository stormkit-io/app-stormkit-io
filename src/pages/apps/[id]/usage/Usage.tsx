import React from "react";
import { Tooltip } from "@material-ui/core";
import Api from "~/utils/api/Api";
import { connect } from "~/utils/context";
import RootContext from "~/pages/Root.context";
import AppContext from "~/pages/apps/App.context";
import InfoBox from "~/components/InfoBox";
import Spinner from "~/components/Spinner";
import UsageBar from "~/components/UsageBar";
import Link from "~/components/Link";
import { useFetchStats } from "./actions";
import { AuthContext } from "~/pages/auth";

interface ContextProps {
  api: Api;
  app: App;
  user: User;
}

const Usage: React.FC<ContextProps> = ({
  api,
  app,
  user,
}): React.ReactElement => {
  const { stats, error, loading } = useFetchStats({ api, app });

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
    <div>
      <h1 className="mb-4 text-2xl text-white flex justify-between">
        <div>Usage</div>
        {user.package.id !== "enterprise" ? (
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

export default connect<unknown, ContextProps>(Usage, [
  { Context: RootContext, props: ["api"] },
  { Context: AppContext, props: ["app"] },
  { Context: AuthContext, props: ["user"] },
]);
