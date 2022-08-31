import React, { useContext, useState } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { AppContext } from "~/pages/apps/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBox";
import Error404 from "~/components/Errors/Error404";
import { PlusButton } from "~/components/Buttons";
import FeatureFlagModal from "./_components/FeatureFlagModal";
import FeatureFlagTable from "./_components/FeatureFlagTable";
import { useFetchFeatureFlags } from "./actions";

const Explanation = () => (
  <p>
    Feature flags that are enabled will be accessible through the
    window.sk.features object.
  </p>
);

const FeatureFlags: React.FC = () => {
  const { app } = useContext(AppContext);
  const { environment } = useContext(EnvironmentContext);
  const [selectedFlag, setSelectedFlag] = useState<FeatureFlag>();
  const [isFeatureFlagModalOpen, setFeatureFlagModal] = useState(false);
  const { error, loading, flags, setError, setLoading, setReload } =
    useFetchFeatureFlags({
      app,
      environment: environment!,
    });

  if (!environment) {
    return <Error404 />;
  }

  return (
    <div className="flex flex-col mt-4">
      <div className="flex bg-white rounded mb-4 p-8 items-center">
        <div className="flex-auto">
          <h2 className="text-lg font-bold mb-1 flex flex-auto items-center">
            Feature Flags
            <Tooltip title={<Explanation />} placement="top" arrow>
              <span className="fas fa-question-circle ml-2" />
            </Tooltip>
          </h2>
        </div>
        <div className="flex-shrink-0">
          <PlusButton
            onClick={() => {
              setFeatureFlagModal(true);
            }}
            className="p-2 rounded"
            size="small"
          />
        </div>
      </div>
      <div className="flex flex-auto rounded align-middle">
        {loading && (
          <div className="p-8  justify-center flex items-center w-full bg-white rounded">
            <Spinner primary />
          </div>
        )}
        {!loading && error && <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>}
        {!loading && flags && (
          <div className="w-full relative">
            {isFeatureFlagModalOpen && (
              <FeatureFlagModal
                app={app}
                environment={environment}
                flag={selectedFlag}
                setReload={setReload}
                closeModal={() => {
                  setSelectedFlag(undefined);
                  setFeatureFlagModal(false);
                }}
              />
            )}
            <FeatureFlagTable
              featureFlags={flags}
              app={app}
              setReload={setReload}
              setError={setError}
              setLoading={setLoading}
              environment={environment}
              setSelectedFlag={flag => {
                setSelectedFlag(flag);
                setFeatureFlagModal(true);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureFlags;
