import React from "react";
import cn from "classnames";

interface StatusProps {
  status?: number;
}

const DomainStatus: React.FC<StatusProps> = ({
  status,
}): React.ReactElement => {
  return (
    <div className="flex items-center">
      <span
        className={cn(
          {
            "text-green-50": status === 200,
            "text-red-50": status && status !== 200,
          },
          "flex",
          "items-center",
          "align-baseline"
        )}
      >
        <span className={cn("fa-solid fa-globe", { "mr-2": status })} />
        {status}
      </span>
    </div>
  );
};

export default DomainStatus;
