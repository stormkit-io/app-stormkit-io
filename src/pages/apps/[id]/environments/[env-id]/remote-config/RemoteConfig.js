import React from "react";
import PropTypes from "prop-types";
import Tooltip from "@material-ui/core/Tooltip";
import { connect } from "~/utils/context";
import RootContext from "~/pages/Root.context";
import AppContext from "~/pages/apps/App.context";
import EnvironmentContext from "~/pages/apps/[id]/environments/[env-id]/Environment.context";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBox";
import { PlusButton } from "~/components/Buttons";
import { useFetchRemoteConfig } from "./actions";
import { sortConfigByKey } from "./helpers";
import Parameter from "./_components/Parameter";
import ParameterModal from "./_components/ParameterModal";

const Explanation = () => (
  <p>
    Remote configuration helps you configure your application without the need
    of a deployment. <br /> <br />
    All parameters defined here will be available to your source code
    immediately as they are injected during the request.
    <br />
    <br />
    You can define multiple values for a single parameter, and apply conditions
    to determine which value will be picked.
  </p>
);

const RemoteConfig = ({
  api,
  app,
  environment: env,
  toggleModal,
  location,
}) => {
  const fetchOpts = { api, app, env, location };
  const { loading, error, config } = useFetchRemoteConfig(fetchOpts);
  const sorted = sortConfigByKey(config);

  return (
    <div className="flex flex-col mt-4">
      <div className="flex bg-white rounded mb-4 p-8">
        <div className="flex-auto">
          <h2 className="text-lg font-bold mb-1 flex flex-auto items-center">
            Remote config
            <Tooltip title={<Explanation />} placement="top" arrow>
              <span className="fas fa-question-circle ml-2" />
            </Tooltip>
          </h2>
          <h3 className="text-xs">
            <span className="opacity-50">
              These parameters are sorted alphabetically
            </span>
            <span className="fas fa-sort-alpha-up ml-1" />
          </h3>
        </div>
        <div className="flex-shrink-0">
          <PlusButton
            onClick={() => toggleModal(true)}
            className="p-2 rounded"
            size="small"
          />
        </div>
      </div>
      <div className="flex flex-auto rounded">
        {loading && (
          <div
            data-testid="remote-config-spinner"
            className="p-8 flex items-center w-full bg-white rounded"
          >
            <Spinner primary />
          </div>
        )}
        {!loading && error && <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>}
        {!loading && (
          <div className="w-full relative">
            {Object.keys(sorted).map((name, i) => (
              <Parameter
                key={name}
                index={i}
                config={config}
                parameter={{ ...sorted[name], name }}
                isLastRow={i === config.length - 1}
              />
            ))}
            <ParameterModal config={config} />
          </div>
        )}
      </div>
    </div>
  );
};

RemoteConfig.propTypes = {
  api: PropTypes.object,
  app: PropTypes.object,
  environment: PropTypes.object,
  toggleModal: PropTypes.func,
  location: PropTypes.object,
};

export default connect(RemoteConfig, [
  { Context: RootContext, props: ["api"] },
  { Context: AppContext, props: ["app"] },
  { Context: EnvironmentContext, props: ["environment"] },
  { Context: ParameterModal, props: ["toggleModal"], wrap: true },
]);
