import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import RootContext from "~/pages/Root.context";
import { connect } from "~/utils/context";
import Link from "~/components/Link";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBox";
import { useFetchStatus, STATUS } from "../actions";

const Status = ({ status }) => {
  return (
    <div className="flex items-center">
      <span
        className={cn("text-sm", {
          "text-green-50": status === STATUS.OK,
          "text-red-50": status !== STATUS.OK,
        })}
      >
        <span className={"fas fa-fw fa-globe mr-2"} />
        {status !== STATUS.NOT_CONFIGURED && status}
        {status === STATUS.NOT_CONFIGURED && "Not yet deployed"}
      </span>
    </div>
  );
};

Status.propTypes = {
  status: PropTypes.any,
};

const Environment = ({
  environment = {},
  app,
  api,
  isClickable,
  isEditable,
}) => {
  const { lastDeploy } = environment;
  const name = environment.name || environment.env;
  const domain = environment.getDomainName();
  const environmentUrl = `/apps/${app.id}/environments/${environment.id}`;

  const { status, loading } = useFetchStatus({ domain, lastDeploy, api, app });

  return (
    <div
      className={cn(
        "flex flex-auto p-8 bg-white rounded border-l-8 border-solid",
        {
          "border-yellow-50": status === STATUS.NOT_FOUND,
          "border-green-50": status === STATUS.OK,
          "border-red-50": (status || "").toString()[0] === "5",
        }
      )}
    >
      <div className="flex flex-col flex-auto">
        <h2 className="flex items-center text-xl font-bold mb-6">
          {isClickable ? (
            <>
              <Link
                to={environmentUrl}
                className="inline-flex items-center text-primary hover:text-pink-50 font-bold"
              >
                {name}
                <span className="fas fa-chevron-right text-base ml-2" />
              </Link>
            </>
          ) : (
            name
          )}
          {isEditable && (
            <Link
              to={`${environmentUrl}/edit`}
              className="text-xs flex-auto text-right"
              tertiary
            >
              <span className="icon-bg bg-gray-90 mr-2">
                <i className="fas fa-pen" />
              </span>
              <span className="font-normal">Edit</span>
            </Link>
          )}
        </h2>
        <div className="text-sm bg-gray-90 p-4 rounded-sm">
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
              The 404 may happen when the distributed folder does not contain an{" "}
              <b>index.html</b>.{" "}
              <Link to={`https://www.stormkit.io/docs/deployments`} secondary>
                Learn more
              </Link>{" "}
              on deployments.
            </div>
          </InfoBox>
        )}
      </div>
    </div>
  );
};

Environment.propTypes = {
  environment: PropTypes.object,
  app: PropTypes.object,
  api: PropTypes.object,
  isClickable: PropTypes.bool,
  isEditable: PropTypes.bool,
};

export default connect(Environment, [{ Context: RootContext, props: ["api"] }]);
