import React, { useState } from "react";
import PropTypes from "prop-types";
import AppContext from "~/pages/Apps/Apps.context";
import RootContext from "~/pages/Root.context";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBox";
import Button from "~/components/Button";
import { connect } from "~/utils/context";
import { useFetchEnvironments } from "../Environments/actions";
import { useFetchDeployments } from "./actions";
import Deployment from "./_components/Deployment";
// import Filters from "./_components/Filters";

const Deployments = ({ app, api, location }) => {
  const [from, setFrom] = useState(0);
  const envs = useFetchEnvironments({ api, app });
  const depls = useFetchDeployments({ app, api, location, from });
  const loading = envs.loading || depls.loading;
  const error = envs.error || depls.error;
  const { environments } = envs;
  const { deployments, success, hasNextPage, setDeployments } = depls;

  if (error) {
    return (
      <div className="flex justify-center bg-white rounded p-4">
        <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>
      </div>
    );
  }

  return (
    <>
      {/* <div className="flex flex-col justify-center bg-white rounded p-4 mb-4"><Filters /></div> */}
      {success && (
        <InfoBox type={InfoBox.SUCCESS} className="mb-4" dismissable>
          <div className="flex-auto">{success}</div>
        </InfoBox>
      )}
      {loading && from === 0 ? (
        <div className="flex justify-center bg-white rounded p-4">
          <Spinner primary />
        </div>
      ) : (
        <div className="flex flex-col justify-center bg-white rounded p-4 mb-4">
          {deployments.map((d, i) => (
            <Deployment
              deployment={d}
              environments={environments}
              deployments={deployments}
              setDeployments={setDeployments}
              index={i}
              app={app}
              api={api}
              key={d.id}
            />
          ))}
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
    </>
  );
};

Deployments.propTypes = {
  app: PropTypes.object,
  api: PropTypes.object,
  location: PropTypes.object,
};

export default connect(Deployments, [
  { Context: RootContext, props: ["api"] },
  { Context: AppContext, props: ["app"] },
]);
