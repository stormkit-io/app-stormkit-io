import React from "react";
import { Tooltip } from "@mui/material";
import cn from "classnames";

const EXIT_SUCCESS = 0;
const EXIT_STOPPED_MANUALLY = -1;

const Status: React.FC<{ code: number | null; emptyPackage: boolean }> = ({
  code,
  emptyPackage,
}) => {
  const bgColor = emptyPackage
    ? "bg-yellow-10"
    : code === EXIT_SUCCESS
    ? "bg-green-70"
    : code === EXIT_STOPPED_MANUALLY
    ? "bg-red-60"
    : code !== null
    ? "bg-red-50"
    : "bg-blue-40";

  return (
    <Tooltip
      title={
        emptyPackage
          ? "Deployment has no content uploaded"
          : code === EXIT_STOPPED_MANUALLY
          ? "Stopped manually"
          : code === null
          ? "Deployment still running"
          : code === EXIT_SUCCESS
          ? "Successful"
          : "Failed"
      }
    >
      <span className={cn(bgColor, "w-2 h-2 block")} />
    </Tooltip>
  );
};

export default Status;
