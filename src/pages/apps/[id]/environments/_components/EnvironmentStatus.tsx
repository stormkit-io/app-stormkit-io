import React from "react";
import cn from "classnames";
import Link from "~/components/Link";
import Button from "~/components/ButtonV2";
import { useFetchStatus } from "../actions";
import { deployNow } from "~/utils/helpers/deployments";

interface Props {
  env: Environment;
  app: App;
}

const EnvironmentStatus: React.FC<Props> = ({ env, app }) => {
  const endpoint =
    env.customStorage?.externalUrl ||
    (env.domain?.verified && env.domain?.name) ||
    env?.preview ||
    "";

  const { status } = useFetchStatus({
    environment: env,
    app,
    domain: endpoint,
  });

  if (env.published) {
    return (
      <>
        <div className="flex">
          <label className="flex w-20 text-gray-50">Endpoint</label>
          <span>
            <span className="fa fa-external-link w-6 text-gray-50"></span>
            <Link to={endpoint}>{endpoint.replace(/https?:\/\//, "")}</Link>
          </span>
        </div>
        <div className="flex mt-3">
          <label className="flex w-20 text-gray-50">Published</label>
          <span>
            <span
              className="fa fa-ship w-6 text-gray-50"
              style={{ marginLeft: "-1px" }}
            ></span>
            {env.published.map(p => (
              <Link
                key={p.deploymentId}
                to={`/apps/${env.appId}/environments/${env.id}/deployments/${p.deploymentId}`}
              >
                {p.deploymentId}
              </Link>
            ))}
          </span>
        </div>
        <div className="flex mt-3">
          <label className="flex w-20 text-gray-50">Status</label>
          <span
            className={cn({
              "text-green-50": status === 200 || status === 304,
            })}
          >
            <span
              className={cn("fa fa-globe w-6", {
                "text-gray-50": status !== 200 && status !== 304,
              })}
            ></span>
            {status}
          </span>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center">
        <label className="flex w-20 text-gray-50">Status</label>
        <span
          className={cn("w-2 h-2 inline-block mr-4", {
            "bg-green-50": env.lastDeploy?.exit === 0,
            "bg-red-50": env.lastDeploy?.exit !== 0,
            "bg-yellow-50": !env.lastDeploy,
          })}
        />
        {env.lastDeploy?.createdAt ? (
          env.lastDeploy?.exit === 0 ? (
            <span>
              Deployed successfully.{" "}
              <Link
                to={`/apps/${app.id}/environments/${env.id}/deployments/${env.lastDeploy.id}`}
              >
                Go to deployment <span className="fa fa-chevron-right" />
              </Link>
            </span>
          ) : (
            "Deployment failed."
          )
        ) : (
          <span>
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
          </span>
        )}
      </div>
    </>
  );
};

export default EnvironmentStatus;
