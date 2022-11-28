import React, { useContext } from "react";
import { AppContext } from "~/pages/apps/[id]/App.context";
import Container from "~/components/Container";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBoxV2";
import Button from "~/components/ButtonV2";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import { useWithCollections } from "./actions";

const DataStore: React.FC = () => {
  const { app } = useContext(AppContext);
  const { environment } = useContext(EnvironmentContext);
  const { loading, error, collections } = useWithCollections({
    appId: app.id,
    envId: environment.id!,
  });

  return (
    <Container title="Collections" maxWidth="max-w-none">
      {loading && (
        <div className="flex items-center">
          <Spinner />
        </div>
      )}
      {!loading && error && <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>}
      {!loading && !error && (
        <div className="pb-4">
          {collections.map((collection, i) => (
            <Button
              href={`./${collection.name}`}
              key={collection.name}
              className="p-4 mx-4 bg-blue-10 flex justify-between"
              styled={false}
            >
              <span>{collection.name}</span>
              <span className="inline-flex items-center">
                {collection.count} records
                <span className="fas fa-chevron-right text-base ml-2" />
              </span>
            </Button>
          ))}
        </div>
      )}
    </Container>
  );
};

export default DataStore;
