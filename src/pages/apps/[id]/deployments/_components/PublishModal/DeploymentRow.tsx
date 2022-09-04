import React, { useEffect, useState } from "react";
import cn from "classnames";
import Slider from "@mui/material/Slider";
import Button from "~/components/Button";
import CommitInfo from "../CommitInfo";

type HandlePublishClick = (sliders: SlidersObject, envId: string) => void;

interface DeploymentRowProps {
  deployment: Deployment;
  envId: string;
  environments: Array<Environment>;
  index: number;
  numberOfDeployments: number;
  handlePublishClick?: HandlePublishClick;
  displaySlider: boolean;
  isInSync: boolean;
  initialPercentage: number;
}

interface SliderRecord {
  percentage: number;
  setPercentage: (v: number) => void;
  envId: string;
}

type SlidersObject = Record<string, SliderRecord>;

const sliders: SlidersObject = {};

const getDomainOrEnvName = (env: Environment) => {
  return env.domain?.name && env.domain?.verified ? env.domain.name : env.env;
};

const DeploymentRow: React.FC<DeploymentRowProps> = ({
  deployment,
  envId,
  environments,
  index,
  numberOfDeployments,
  handlePublishClick,
  isInSync,
  displaySlider,
  initialPercentage,
}): React.ReactElement => {
  const [percentage, setPercentage] = useState(initialPercentage);

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
        {displaySlider && (
          <div className="flex mt-8">
            <Slider
              data-testid={`slider-${deployment.id}`}
              name="deployment-publish"
              value={percentage}
              valueLabelDisplay={
                handlePublishClick || !isInSync ? "auto" : "on"
              }
              disabled={!handlePublishClick && isInSync}
              step={isInSync ? numberOfDeployments : 1}
              onChange={(_, v) => {
                const value = Math.ceil(Array.isArray(v) ? v[0] : v);
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
        )}
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

export default DeploymentRow;
