import { Tooltip } from "@mui/material";
import React from "react";

interface Props {
  percentage?: number;
  showNotPublishedInfo?: boolean;
}

const ReleaseInfo: React.FC<Props> = ({ percentage, showNotPublishedInfo }) => {
  if (!percentage && !showNotPublishedInfo) {
    return <></>;
  }

  if (!percentage && showNotPublishedInfo) {
    return (
      <Tooltip
        title={
          <div className="text-center">
            Click on the menu to publish this deployment.
          </div>
        }
        arrow
      >
        <span
          className="inline-flex bg-gray-50 rounded-lg text-xs py-1 px-3 font-bold"
          style={{ transform: "scale(0.85)" }}
        >
          Not published
        </span>
      </Tooltip>
    );
  }

  return (
    <span
      className="inline-flex bg-green-50 rounded-lg text-xs py-1 px-3 font-bold"
      style={{ transform: "scale(0.85)" }}
    >
      Published: {percentage} <span className="fa-light fa-percent" />
    </span>
  );
};

export default ReleaseInfo;
