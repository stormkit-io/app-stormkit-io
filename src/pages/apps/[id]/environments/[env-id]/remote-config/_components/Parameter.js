import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { withRouter } from "react-router-dom";
import { connect } from "~/utils/context";
import RootContext from "~/pages/Root.context";
import AppContext from "~/pages/apps/App.context";
import EnvironmentContext from "~/pages/apps/[id]/environments/[env-id]/Environment.context";
import DotDotDot from "~/components/DotDotDot";
import ConfirmModal from "~/components/ConfirmModal";
import { deleteKeyFromConfig } from "../actions";
import Targetings from "./Targetings";
import ParameterModal from "./ParameterModal";

const Parameter = ({
  parameter,
  isLastRow,
  toggleModal,
  config,
  confirmModal,
  api,
  app,
  environment,
  history,
}) => {
  return (
    <div className={cn("text-xs", { "mb-4": !isLastRow })}>
      <div className="p-8 border border-solid border-gray-85 rounded-tl rounded-tr flex items-center bg-white">
        <div className="flex-auto">
          <h2 className="font-bold mb-1 text-base">{parameter.name}</h2>
          <h3 className="opacity-75">{parameter.desc}</h3>
          {parameter.experimentId && (
            <h3 className="opacity-75 mt-1">
              Experiment ID: {parameter.experimentId}
            </h3>
          )}
        </div>
        <DotDotDot aria-label="Expand options">
          <DotDotDot.Item
            aria-label="Edit parameter"
            onClick={() => toggleModal(true)}
          >
            <span className="fas fa-pen mr-2" />
            Edit
          </DotDotDot.Item>
          <DotDotDot.Item
            aria-label="Delete parameter"
            onClick={() =>
              confirmModal(
                "This will completely remove the parameter and it won't be available anymore to your source code.",
                {
                  onConfirm: ({ setLoading, setError, closeModal }) => {
                    deleteKeyFromConfig({
                      api,
                      app,
                      environment,
                      config,
                      history,
                      setLoading,
                      setError,
                      closeModal,
                    })(parameter.name);
                  },
                }
              )
            }
          >
            <span className="fas fa-times text-red-50 mr-2" />
            Delete
          </DotDotDot.Item>
        </DotDotDot>
      </div>
      <div className="flex flex-wrap w-full bg-gray-90 border border-t-0 border-solid border-gray-85 rounded-br rounded-bl px-4">
        {parameter.targetings.map((targeting, i) => (
          <Targetings
            key={`t-${i}`}
            targeting={targeting}
            index={i}
            maxIndex={parameter.targetings.length}
          />
        ))}
      </div>
      <ParameterModal parameter={parameter} config={config} />
    </div>
  );
};

Parameter.propTypes = {
  parameter: PropTypes.object,
  isLastRow: PropTypes.bool,
  name: PropTypes.string,
  index: PropTypes.number,
  config: PropTypes.object, // The whole remote-config object.
  environment: PropTypes.object,
  confirmModal: PropTypes.func,
  api: PropTypes.object,
  app: PropTypes.object,
  history: PropTypes.object,
};

export default connect(withRouter(Parameter), [
  { Context: ParameterModal, props: ["toggleModal"], wrap: true },
  { Context: ConfirmModal, props: ["confirmModal"], wrap: true },
  { Context: RootContext, props: ["api"] },
  { Context: AppContext, props: ["app"] },
  { Context: EnvironmentContext, props: ["environment"] },
]);
