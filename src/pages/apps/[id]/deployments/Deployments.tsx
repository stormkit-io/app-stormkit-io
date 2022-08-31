import React, { useContext, useState } from "react";
import { AppContext } from "~/pages/apps/App.context";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBox";
import Button from "~/components/Button";
import { useFetchDeployments, Filters as IFilters } from "./actions";
import Deployment from "./_components/Deployment";
import Filters from "./_components/Filters";
import EmptyState from "./_components/EmptyState";

const Deployments: React.FC = (): React.ReactElement => {
  const { app, environments } = useContext(AppContext);
  const [from, setFrom] = useState(0);
  const [filters, setFilters] = useState<IFilters>({});

  const { deployments, success, hasNextPage, setDeployments, loading, error } =
    useFetchDeployments({ app, from, setFrom, filters });

  setDeployments;
  if (error) {
    return (
      <div className="flex justify-center bg-white rounded p-4">
        <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-8 flex items-center">
        <span className="text-2xl text-white">Deployments</span>
      </h1>
      {/* <div className="flex flex-col justify-center bg-white rounded p-4 mb-4"><Filters /></div> */}
      {success && (
        <InfoBox type={InfoBox.SUCCESS} className="mb-4" dismissable>
          <div className="flex-auto">{success}</div>
        </InfoBox>
      )}
      <Filters
        filters={filters}
        environments={environments}
        onFilterChange={setFilters}
      />
      {loading && from === 0 ? (
        <div className="flex justify-center bg-white rounded p-4">
          <Spinner primary />
        </div>
      ) : (
        <div className="flex flex-col justify-center bg-white rounded p-4 mb-4">
          {!deployments.length ? (
            <EmptyState hasFilters={Boolean(Object.keys(filters).length)} />
          ) : (
            deployments.map((d, i) => (
              <Deployment
                deployment={d}
                environments={environments}
                deployments={deployments}
                setDeployments={setDeployments}
                index={i}
                app={app}
                key={d.id}
              />
            ))
          )}
          {hasNextPage && (
            <div className="flex justify-center w-full mt-4">
              <Button
                className="px-12"
                secondary
                onClick={() => setFrom(from + 20)}
                loading={loading}
              >
                Load more
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Deployments;
