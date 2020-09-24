import React, { useState } from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import { formattedDate } from "~/utils/helpers/deployments";
import { connect } from "~/utils/context";
import DotDotDot from "~/components/DotDotDot";
import Spinner from "~/components/Spinner";
import ExitStatus from "./ExitStatus";
import PublishModal from "./PublishModal";
import CommitInfo from "./CommitInfo";
import { deleteForever } from "../actions";

const Deployment = ({
  deployment,
  deployments,
  environments,
  index,
  api,
  app,
  toggleModal,
  setDeployments
}) => {
  const [loading, setLoading] = useState(false);

  const urls = {
    environment: `/apps/${deployment.appId}/environments/${deployment.config.env}`,
    deployment: `/apps/${deployment.appId}/deployments/${deployment.id}`,
    preview: deployment.preview
  };

  const isDisabled = deployment.exit !== 0;
  return (
    <>
      <div
        className={cn("flex w-full px-4 py-6 rounded", {
          "bg-gray-83": index % 2 === 1
        })}
      >
        <div className="flex flex-grow-0 items-start mr-4 pt-1">
          <ExitStatus code={deployment.exit} className="text-lg" iconOnly />
        </div>
        <div className="flex flex-col flex-auto leading-loose text-sm">
          <CommitInfo deployment={deployment} environments={environments} />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-auto justify-end">
            <DotDotDot>
              <DotDotDot.Item
                onClick={() => toggleModal(true)}
                disabled={isDisabled}
              >
                <span className="text-pink-50">Publish</span>
              </DotDotDot.Item>
              <DotDotDot.Item href={urls.preview} disabled={isDisabled}>
                Preview <i className="fas fa-external-link-square-alt ml-2" />
              </DotDotDot.Item>
              <DotDotDot.Item href={urls.deployment}>
                View Details
              </DotDotDot.Item>
              <DotDotDot.Item
                disabled={deployment.isRunning}
                onClick={() => {
                  deleteForever({
                    api,
                    appId: app.id,
                    deploymentId: deployment.id,
                    setLoading,
                    setDeployments,
                    deployments,
                    index
                  });

                  return false;
                }}
              >
                {!loading ? "Delete" : <Spinner width={4} height={4} primary />}
              </DotDotDot.Item>
            </DotDotDot>
          </div>
          <div className="text-sm">{formattedDate(deployment.createdAt)}</div>
        </div>
      </div>
      <PublishModal
        api={api}
        app={app}
        environments={environments}
        deployment={deployment}
      />
    </>
  );
};

Deployment.propTypes = {
  toggleModal: PropTypes.func,
  deployment: PropTypes.object,
  environments: PropTypes.array,
  deployments: PropTypes.array,
  setDeployments: PropTypes.func,
  index: PropTypes.number,
  api: PropTypes.object,
  app: PropTypes.object,
  history: PropTypes.object
};

export default connect(Deployment, [
  { Context: PublishModal, props: ["toggleModal"], wrap: true }
]);
