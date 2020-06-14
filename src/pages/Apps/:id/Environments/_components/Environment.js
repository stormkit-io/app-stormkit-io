import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import Link from "~/components/Link";
import Spinner from "~/components/Spinner";
import Button from "~/components/Button";
import InfoBox from "~/components/InfoBox";
import { useFetchStatus, STATUS } from "../actions";

const Status = ({ status }) => {
  return (
    <div className="flex items-center">
      <span
        className={cn("fas fa-fw fa-globe mr-2", {
          "text-green-50": status === STATUS.OK,
          "text-red-50": status !== STATUS.OK,
        })}
      />
      <span
        className={cn("text-sm", {
          "text-green-50": status === STATUS.OK,
          "text-red-50": status !== STATUS.OK,
        })}
      >
        {status !== STATUS.NOT_CONFIGURED && status}
      </span>
    </div>
  );
};

Status.propTypes = {
  status: PropTypes.any,
};

const Environment = ({ environment, app }) => {
  const { lastDeploy } = environment;
  const name = environment.name || environment.env;
  const domain = environment.getDomainName();
  const environmentUrl = `/apps/${app.id}/environments/${environment.id}`;

  const { status, loading } = useFetchStatus({ domain, lastDeploy });

  return (
    <div
      className={cn(
        "flex flex-auto p-8 bg-white mb-4 rounded mr-4 border-l-8 border-solid",
        {
          "border-yellow-50": status === STATUS.NOT_FOUND,
          "border-green-50": status === STATUS.OK,
          "border-red-50": (status || "").toString()[0] === "5",
        }
      )}
    >
      <div className="flex flex-col flex-auto mr-8">
        <h2 className="text-xl font-bold mb-6">
          <Link
            to={environmentUrl}
            className="text-primary hover:text-pink-50 font-bold"
          >
            {name}
          </Link>
        </h2>
        <div className="text-sm">
          <div className="flex mb-6">
            <div className="w-32">Endpoint</div>
            <div className="flex items-center">
              <span className="opacity-50 fas fa-fw fa-external-link-square-alt mr-2" />
              <Link tertiary to={`https://${domain}`}>
                {domain}
              </Link>
            </div>
          </div>
          <div className="flex mb-6">
            <div className="w-32">Status</div>
            <div className="flex items-center">
              {loading ? (
                <Spinner primary width={4} height={4} />
              ) : (
                <Status status={status} />
              )}
            </div>
          </div>
          <div className="flex">
            <div className="w-32">Branch</div>
            <div className="flex items-center ">
              <span className="opacity-50 fas fa-fw fa-code-branch mr-2" />
              {environment.branch}
            </div>
          </div>
        </div>
        {status === STATUS.NOT_FOUND && (
          <InfoBox
            type={InfoBox.WARNING}
            className="mt-4 text-sm leading-relaxed"
            showIcon={false}
          >
            <span className="opacity-50 fas fa-lightbulb mr-4" />
            <div>
              This may happen when the distributed folder does not contain an{" "}
              <b>index.html</b>.{" "}
              <Link to={`https://www.stormkit.io/docs/deployments`} secondary>
                Learn more
              </Link>{" "}
              on deployments.
            </div>
          </InfoBox>
        )}
      </div>
      <Button
        as="div"
        styled={false}
        href={environmentUrl}
        className="flex items-center bg-gray-90 hover:bg-gray-75 px-4 rounded"
      >
        <span className="opacity-50 fas fa-chevron-right text-xl" />
      </Button>
    </div>
  );
};

Environment.propTypes = {
  environment: PropTypes.object,
  app: PropTypes.object,
};

export default Environment;
