import React from "react";
import PropTypes from "prop-types";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "~/components/Button";

const EnvInfo = ({ env, percentage }) => {
  if (!env || !percentage) {
    return null;
  }

  const name = env.name || env.env;

  return (
    <Tooltip
      title={`This deployment has been released to ${name}`}
      placement="top"
      arrow
    >
      <Button
        as="span"
        styled={false}
        href={`/apps/${env.appId}/environments/${env.id}`}
        className="py-1 px-2 bg-green-50 text-white rounded text-xs ml-2 font-normal"
      >
        {name} {percentage}%
      </Button>
    </Tooltip>
  );
};

EnvInfo.propTypes = {
  env: PropTypes.object,
  percentage: PropTypes.number
};

const PublishedInfo = ({ deployment, environments }) => {
  if (!deployment.published?.length) {
    return null;
  }

  return deployment.published.map(p => (
    <EnvInfo
      key={`${p.envId}${p.percentage}`}
      env={environments.filter(e => e.id === p.envId)[0]}
      percentage={p.percentage}
    />
  ));
};

PublishedInfo.propTypes = {
  deployment: PropTypes.object,
  environments: PropTypes.array
};

export default PublishedInfo;
