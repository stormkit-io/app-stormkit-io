import React from "react";
import PropTypes from "prop-types";
import AppsContext from "~/pages/Apps/Apps.context";
import Environment from "./_components/Environment";
import { connect } from "~/utils/context";

const Environments = ({ app, environments }) => {
  return (
    <div>
      <h1 className="mb-8 flex items-center">
        <span className="text-2xl text-white">Environments</span>
      </h1>
      <div className="flex flex-col w-full flex-wrap">
        {environments.map((env) => (
          <div className="mb-4" key={env.id}>
            <Environment environment={env} app={app} isClickable />
          </div>
        ))}
      </div>
    </div>
  );
};

Environments.propTypes = {
  environments: PropTypes.array,
  app: PropTypes.object,
};

export default connect(Environments, [
  { Context: AppsContext, props: ["app", "environments"] },
]);
