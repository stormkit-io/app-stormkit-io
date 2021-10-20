import React from "react";
import noDeployment from "~/assets/images/no-deployments.svg";
import noResult from "~/assets/images/empty-filter-result.svg";

interface Props {
  hasFilters?: boolean;
}

const EmptyState: React.FC<Props> = ({ hasFilters }) => {
  const msg = hasFilters
    ? {
        title: "No deployments were found matching these filters.",
        subtitle: "Change the filters above to run a new query.",
        svg: noResult,
      }
    : {
        title: "It's quite empty here.",
        subtitle:
          "Hit the Deploy Now button above to start your first deployment.",
        svg: noDeployment,
      };

  return (
    <div className="flex justify-center flex-col items-center py-16">
      <h2 className="text-xl mb-4">{msg.title}</h2>
      <h3 className="text-m mb-16">{msg.subtitle}</h3>
      <img
        className="box-content h-48 w-48"
        src={msg.svg}
        alt="No deployment"
      />
    </div>
  );
};

export default EmptyState;
