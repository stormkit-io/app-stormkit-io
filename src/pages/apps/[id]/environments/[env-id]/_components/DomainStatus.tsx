import React from "react";
import cn from "classnames";
import Spinner from "~/components/Spinner";

interface StatusProps {
  status?: number;
  loading?: boolean;
}

const DomainStatus: React.FC<StatusProps> = ({
  status,
  loading,
}): React.ReactElement => {
  return (
    <div className="flex items-center">
      {loading && <Spinner width={4} height={4} />}
      {!loading && (
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
          <span className="font-light">{status}</span>
        </span>
      )}
    </div>
  );
};

export default DomainStatus;
