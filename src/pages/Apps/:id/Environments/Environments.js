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
      <h1 className="mb-8 flex items-center">
        <span className="text-2xl text-white">Environments</span>
      </h1>
      <div className="flex flex-col w-full flex-wrap">
        {environments.map((env) => (
          <div className="mb-4" key={env.id}>
            <Environment environment={env} app={app} isClickable />
          </div>
        ))}
        <PlusButton
          onClick={() => toggleModal(true)}
          className="bg-white mb-8 rounded"
          aria-label="Insert environment"
        />
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
