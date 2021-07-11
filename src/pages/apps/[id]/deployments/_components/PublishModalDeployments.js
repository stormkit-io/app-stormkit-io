import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import Slider from "@material-ui/core/Slider";
import Form from "~/components/Form";
import InfoBox from "~/components/InfoBox";
import Spinner from "~/components/Spinner";
import Button from "~/components/Button";
import CommitInfo from "./CommitInfo";

const sliders = {};

const getInitialPerc = (deployment, envId) => {
  return (
    deployment.published.filter(p => p.envId === envId)[0]?.percentage || 0
  );
};

const getDomainOrEnvName = env => {
  return env.domain?.name && env.domain?.verified ? env.domain.name : env.env;
};

const DeploymentRow = ({
  deployment,
  envId,
  environments,
  index,
  numberOfDeployments,
  handlePublishClick,
  isInSync,
}) => {
  const [percentage, setPercentage] = useState(
    getInitialPerc(deployment, envId)
  );

  const env = environments.filter(e => e.id === envId)[0];
  const domainOrEnvName = getDomainOrEnvName(env);

  // This is used to sync other sliders
  useEffect(() => {
    sliders[deployment.id] = { percentage, setPercentage, envId };
  }, [deployment.id, percentage, setPercentage, envId]);

  useEffect(() => {
    return () => {
      delete sliders[deployment.id];
    };
  }, [deployment.id]);

  return (
    <>
      <div
        className={cn(
          "flex flex-col w-full px-4 py-6 rounded border border-solid",
          {
            "mb-4": !handlePublishClick,
            "bg-gray-83 border-gray-80": index % 2 === 0,
            "bg-gray-90 border-gray-80": index % 2 === 1,
          }
        )}
      >
        <div className="flex flex-col flex-auto leading-loose text-sm">
          <CommitInfo deployment={deployment} environments={environments} />
        </div>
        <div className="flex mt-8">
          <Slider
            name="deployment-publish"
            value={percentage}
            valueLabelDisplay={handlePublishClick || !isInSync ? "auto" : "on"}
            disabled={!handlePublishClick && isInSync}
            step={isInSync ? numberOfDeployments : 1}
            onChange={(_, v) => {
              const value = Math.ceil(v);
              setPercentage(value);
            }}
            onChangeCommitted={() => {
              // Only do this for the main slider
              if (!handlePublishClick || !isInSync) {
                return;
              }

              const keys = Object.keys(sliders).filter(
                id => id !== deployment.id
              );

              keys.forEach(id => {
                sliders[id].setPercentage((100 - percentage) / keys.length);
              });
            }}
          />
        </div>
      </div>
      {handlePublishClick && (
        <div className="flex mt-8 justify-center">
          <Button secondary onClick={() => handlePublishClick(sliders, envId)}>
            Publish to {domainOrEnvName}
          </Button>
        </div>
      )}
    </>
  );
};

DeploymentRow.propTypes = {
  deployment: PropTypes.object,
  environments: PropTypes.array,
  envId: PropTypes.string,
  index: PropTypes.number,
  numberOfDeployments: PropTypes.number,
  handlePublishClick: PropTypes.func,
  isInSync: PropTypes.bool,
};

const PublishModalDeploymentTable = ({
  deployments,
  deployment,
  envId,
  environments,
  loading,
  error,
  handlePublishClick,
}) => {
  const [isInSync, setIsInSync] = useState(true);

  if (deployments.length === 0 && !deployment) {
    return null;
  }

  return (
    <div>
      <DeploymentRow
        index={1}
        deployment={deployment}
        envId={envId}
        environments={environments}
        numberOfDeployments={deployments.length}
        handlePublishClick={handlePublishClick}
        isInSync={isInSync}
      />

      <div className="flex items-center mt-16 mb-8">
        <h2 className="text-base flex-auto">
          Currently published deployments in{" "}
          <span className="font-bold">
            {environments.filter(e => e.id === envId)[0].env}
          </span>
        </h2>
        <div>
          <Form.Switch
            checked={isInSync}
            onChange={e => setIsInSync(e.target.checked)}
          />
          Sync sliders
        </div>
      </div>

      {loading && (
        <div className="flex w-full justify-center">
          <Spinner primary />
        </div>
      )}
      {error && (
        <InfoBox type={InfoBox.ERROR}>
          <div>{error}</div>
        </InfoBox>
      )}

      {!loading &&
        !error &&
        (deployments.length > 0 ? (
          deployments.map((d, index) => (
            <DeploymentRow
              key={d.id}
              index={index}
              deployment={d}
              envId={envId}
              environments={environments}
              isInSync={isInSync}
              numberOfDeployments={deployments.length}
            />
          ))
        ) : (
          <InfoBox>
            <div>You have no deployments published here.</div>
          </InfoBox>
        ))}
    </div>
  );
};

PublishModalDeploymentTable.propTypes = {
  environments: PropTypes.array,
  deployments: PropTypes.array,
  deployment: PropTypes.object,
  envId: PropTypes.string,
  loading: PropTypes.bool,
  error: PropTypes.node,
  handlePublishClick: PropTypes.func,
};

export default PublishModalDeploymentTable;
