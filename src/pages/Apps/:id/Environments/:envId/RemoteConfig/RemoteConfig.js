import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "~/utils/context";
import RootContext from "~/pages/Root.context";
import AppsContext from "~/pages/Apps/Apps.context";
import EnvironmentContext from "~/pages/Apps/:id/Environments/:envId/Environment.context";
import ExplanationBox from "~/components/ExplanationBox";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBox";
import Button from "~/components/Button";
import { useFetchRemoteConfig } from "./actions";
import { sortConfigByKey } from "./helpers";
import Parameter from "./_components/Parameter";
import ParameterModal from "./_components/ParameterModal";

const RemoteConfig = ({
  api,
  app,
  environment: env,
  toggleModal,
  location,
}) => {
  const fetchOpts = { api, app, env, location };
  const { loading, error, config } = useFetchRemoteConfig(fetchOpts);
  const [isHover, setIsHover] = useState(false);
  const sorted = sortConfigByKey(config);

  return (
    <div className="flex mt-4">
      <div className="flex flex-auto bg-white p-8 rounded">
        {loading && (
          <div data-testid="remote-config-spinner">
            <Spinner primary />
          </div>
        )}
        {!loading && error && <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>}
        {!loading && (
          <div className="w-full relative">
            <h2 className="text-lg font-bold mb-1 flex">
              Remote config
              <Button
                styled={false}
                className="fas fa-question-circle ml-2"
                onClick={() => setIsHover(!isHover)}
              />
            </h2>
            <h3 className="text-xs opacity-50 mb-8">
              These parameters are sorted alphabetically
              <span className="fas fa-sort-alpha-up ml-1" />
            </h3>
            {isHover && (
              <ExplanationBox
                title="Remote config"
                className="shadow-lg min-w-72 max-w-72 -mt-4 -ml-2"
                absolute
              >
                <p>
                  Remote configuration helps you configure your application
                  without the need of a deployment. <br /> <br />
                  All parameters defined here will be available to your source
                  code immediately as they are injected during the request.
                  <br />
                  <br />
                  You can define multiple values for a single parameter, and
                  apply conditions to determine which value will be picked.
                </p>
              </ExplanationBox>
            )}
            {Object.keys(sorted).map((name, i) => (
              <Parameter
                key={name}
                index={i}
                config={config}
                parameter={{ ...sorted[name], name }}
                isLastRow={i === config.length - 1}
              />
            ))}
            {
              <Button
                styled={false}
                className="border-4 border-dotted border-gray-85 rounded-tl rounded-tr flex items-center w-full mt-4 p-8"
                onClick={() => toggleModal(true)}
              >
                <span className="fas fa-plus text-6xl" />
              </Button>
            }
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
  { Context: AppsContext, props: ["app"] },
  { Context: EnvironmentContext, props: ["environment"] },
  { Context: ParameterModal, props: ["toggleModal"], wrap: true },
]);
