import React from "react";
import PropTypes from "prop-types";
import RootContext from "~/pages/Root.context";
import AppContext from "~/pages/Apps/Apps.context";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBox";
import Environment from "./_components/Environment";
import { connect } from "~/utils/context";
import { useFetchEnvironments } from "./actions";

const Environments = ({ app, api }) => {
  const { environments, loading, error } = useFetchEnvironments({ api, app });

  if (error) {
    return <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>;
  }

  return (
    <div className="flex flex-col w-full flex-wrap">
      {loading && <Spinner primary />}
      {environments.map((env) => (
        <Environment environment={env} app={app} key={env.id} />
      ))}
    </div>
  );
};

Environments.propTypes = {
  api: PropTypes.object,
  app: PropTypes.object,
};

export default connect(Environments, [
  { Context: RootContext, props: ["api"] },
  { Context: AppContext, props: ["app"] },
]);
