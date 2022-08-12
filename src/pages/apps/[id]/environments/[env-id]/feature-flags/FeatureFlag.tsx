import React, { useState } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { connect } from "~/utils/context";
import RootContext, { RootContextProps } from "~/pages/Root.context";
import AppContext, { AppContextProps } from "~/pages/apps/App.context";
import EnvironmentContext from "~/pages/apps/[id]/environments/[env-id]/Environment.context";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBox";
import { PlusButton } from "~/components/Buttons";
import Api from "~/utils/api/Api";
import FeatureFlagModal from "./_components/FeatureFlagModal";
import FeatureFlagTable from "./_components/FeatureFlagTable";
import { useFetchFeatureFlags } from "./actions";

const Explanation = () => (
  <p>
    Feature flags that are enabled will be accessible through the
    window.sk.features object.
  </p>
);

interface Props {
  api: Api;
  app: App;
  environment: Environment;
}

interface ContextProps
  extends Pick<AppContextProps, "app">,
    Pick<RootContextProps, "api"> {
  environment: Environment;
}

const FeatureFlags: React.FC<Props & ContextProps> = ({
  api,
  app,
  environment,
}) => {
  const [selectedFlag, setSelectedFlag] = useState<FeatureFlag>();
  const [isFeatureFlagModalOpen, setFeatureFlagModal] = useState(false);
  const { error, loading, flags, setError, setLoading, setReload } =
    useFetchFeatureFlags({
      api,
      app,
      environment,
    });

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
                api={api}
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
              api={api}
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

export default connect<Props, ContextProps>(FeatureFlags, [
  { Context: RootContext, props: ["api"] },
  { Context: AppContext, props: ["app"] },
  { Context: EnvironmentContext, props: ["environment"] },
]);
