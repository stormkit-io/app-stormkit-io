import React from "react";
import PropTypes from "prop-types";
import AppsContext from "~/pages/Apps/Apps.context";
import RootContext from "~/pages/Root.context";
import { PlusButton } from "~/components/Buttons";
import Environment from "./_components/Environment";
import EnvironmentFormModal from "./_components/EnvironmentFormModal";
import { connect } from "~/utils/context";

const Environments = ({ app, api, environments, toggleModal }) => {
  return (
    <div>
      <div className="flex items-center mb-4">
        <h1 className="flex flex-auto items-center">
          <span className="text-2xl text-white">Environments</span>
        </h1>
        <div className="flex-shrink-0">
          <PlusButton
            onClick={() => toggleModal(true)}
            className="text-white rounded"
            size="small"
            aria-label="Insert environment"
          />
        </div>
      </div>
      <div className="flex flex-col w-full flex-wrap">
        {environments.map((env) => (
          <div className="mb-4" key={env.id}>
            <Environment environment={env} app={app} isClickable />
          </div>
        ))}
        <EnvironmentFormModal app={app} api={api} />
      </div>
    </div>
  );
};

Environments.propTypes = {
  environments: PropTypes.array,
  app: PropTypes.object,
  api: PropTypes.object,
  toggleModal: PropTypes.func,
};

export default connect(Environments, [
  { Context: RootContext, props: ["api"] },
  { Context: AppsContext, props: ["app", "environments"] },
  { Context: EnvironmentFormModal, props: ["toggleModal"], wrap: true },
]);
