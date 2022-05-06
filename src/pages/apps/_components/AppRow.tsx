import React from "react";
import { Browser } from "react-kawaii";
import { formattedDate } from "~/utils/helpers/deployments";
import Button from "~/components/Button";

interface Props {
  app: App;
}

const Row: React.FC<Props> = ({ app }): React.ReactElement => {
  const { repo, id, deployedAt, displayName } = app;

  return (
    <Button
      as="div"
      href={`/apps/${id}`}
      styled={false}
      className="flex w-full items-center p-3 lg:p-4 hover:bg-gray-75 rounded-lg cursor-pointer max-w-full overflow-hidden"
    >
      <div className="mr-4 hidden lg:block">
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
    </Button>
  );
};

export default Row;
