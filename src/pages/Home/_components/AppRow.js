import React from "react";
import PropTypes from "prop-types";
import { Browser } from "react-kawaii";
import { formattedDate } from "~/utils/helpers/deployments";

const Row = (props) => {
  const { repo, id, deployedAt, displayName } = props;

  return (
    <div
      to={`/app/${id}`}
      className="flex items-center p-4 hover:bg-gray-75 rounded-lg cursor-pointer"
    >
      <div className="mr-4">
        <Browser mood="happy" size={50} color="#BCBED0" />
      </div>
      <div className="flex-auto">
        <span className="font-bold">{repo}</span>
        {deployedAt && (
          <div className="pt-2 text-xs">
            last deploy: {formattedDate(deployedAt)}
          </div>
        )}
        <div className="pt-2 text-xs text-gray-50">{displayName}</div>
      </div>
      <span className="fas fa-chevron-right" />
    </div>
  );
};

Row.propTypes = {
  app: PropTypes.array,
};

export default Row;
