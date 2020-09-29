import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import Tooltip from "@material-ui/core/Tooltip";
import RootContext from "~/pages/Root.context";
import { connect } from "~/utils/context";
import Link from "~/components/Link";
import Button from "~/components/Button";
import Spinner from "~/components/Spinner";
import EnvironmentFormModal from "./EnvironmentFormModal";
import { useFetchStatus, STATUS } from "../actions";

const InfoMessage404 = () => (
  <>
    The 404 may happen when the distributed folder does not contain an{" "}
    <b>index.html</b> or the environment has no published deployments.
  </>
);

const Status = ({ status }) => {
  return (
    <div className="flex items-center">
      <span
        className={cn("text-sm", {
          "text-green-50": status === STATUS.OK,
          "text-red-50": status !== STATUS.OK
        })}
      >
        <span className={"fas fa-fw fa-globe mr-2"} />
        {status === null && "Unknown error"}
        {status !== STATUS.NOT_CONFIGURED && status !== null && status}
        {status === STATUS.NOT_CONFIGURED && "Not yet deployed"}
        {status === STATUS.NOT_FOUND && (
          <Tooltip title={<InfoMessage404 />} placement="top" arrow>
            <span className="opacity-50 fas fa-question-circle ml-2 cursor-pointer" />
          </Tooltip>
        )}
      </span>
    </div>
  );
};

Status.propTypes = {
  status: PropTypes.any
};

const Environment = ({
  environment = {},
  app,
  api,
  isClickable,
  isEditable,
  toggleModal
}) => {
  const { lastDeploy } = environment;
  const name = environment.name || environment.env;
  const domain = environment.getDomainName();
  const environmentUrl = `/apps/${app.id}/environments/${environment.id}`;

  const { status, loading } = useFetchStatus({ domain, lastDeploy, api, app });

  return (
    <div
      className={cn(
        "flex flex-auto py-8 bg-white rounded border-l-8 border-solid",
        {
          "border-yellow-50": status === STATUS.NOT_FOUND,
          "border-green-50": status === STATUS.OK,
          "border-red-50": (status || "").toString()[0] === "5"
        }
      )}
    >
      <div className="flex flex-col flex-auto">
        <h2 className="flex items-center text-xl font-bold mb-6 px-8">
          <span className="flex-auto">
            {isClickable ? (
              <Link
                to={environmentUrl}
                className="inline-flex items-center text-primary hover:text-pink-50 font-bold"
              >
                {name}
                <span className="fas fa-chevron-right text-base ml-2" />
              </Link>
            ) : (
              name
            )}
          </span>
          {isEditable && (
            <>
              <Button
                styled={false}
                className="text-xs text-right"
                onClick={() => toggleModal(true)}
                aria-label="Update environment"
                tertiary
              >
                <span className="icon-bg bg-gray-90 mr-2">
                  <i className="fas fa-pen" />
                </span>
                <span className="font-normal">Edit</span>
              </Button>
              <EnvironmentFormModal
                environment={environment}
                app={app}
                api={api}
              />
            </>
          )}
        </h2>
        <div className="flex-auto text-sm bg-gray-90 p-4 px-8">
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
  toggleModal: PropTypes.func
};

export default connect(Environment, [
  { Context: RootContext, props: ["api"] },
  { Context: EnvironmentFormModal, props: ["toggleModal"] }
]);
