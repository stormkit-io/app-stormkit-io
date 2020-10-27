import React, { useState } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import { withRouter } from "react-router-dom";
import RootContext from "~/pages/Root.context";
import AppContext from "~/pages/apps/App.context";
import EnvironmentContext from "~/pages/apps/[id]/environments/[env-id]/Environment.context";
import Modal from "~/components/Modal";
import Form from "~/components/Form";
import InfoBox from "~/components/InfoBox";
import Button from "~/components/Button";
import { connect } from "~/utils/context";
import { upsertRemoteConfig } from "../actions";

const ModalContext = Modal.Context();

const ParameterModal = ({
  isOpen,
  toggleModal,
  config,
  parameter,
  api,
  app,
  environment,
  history,
}) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState({});
  const [targetings, setTargetings] = useState(parameter?.targetings || [{}]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => toggleModal(false)}
      className="max-w-screen-lg"
    >
      <h2 className="mb-8 text-xl font-bold">
        {parameter?.name ? "Edit parameter" : "Create parameter"}
      </h2>
      <Form
        handleSubmit={upsertRemoteConfig({
          api,
          app,
          environment,
          config,
          setError,
          setLoading,
          history,
          toggleModal,
        })}
        className="mb-8"
      >
        <h3 className="mb-8 font-bold">Details</h3>
        <div className="mb-4">
          <input type="hidden" name="nameOld" value={parameter?.name} />
          <Form.Input
            name="name"
            label="Name"
            required
            defaultValue={parameter?.name}
            fullWidth
          />
        </div>
        <div className="mb-4">
          <Form.Input
            name="desc"
            label="Description"
            defaultValue={parameter?.desc}
            fullWidth
          />
        </div>
        <div>
          <Form.Input
            name="experimentId"
            label="Experiment ID (optional)"
            defaultValue={parameter?.experimentId}
            fullWidth
          />
        </div>
        <h3 className="my-8 font-bold">Values</h3>
        <div className="flex flex-wrap justify-between mb-4">
          {targetings.map(
            (targeting, i) =>
              !deleted[i] && (
                <div
                  className={cn("flex-auto p-4 rounded bg-gray-90")}
                  style={{
                    minWidth: "49%",
                    maxWidth: "49%",
                    marginRight: i % 2 === 0 ? "%2" : "0",
                    marginBottom: "2%",
                  }}
                  key={`t${i}`}
                >
                  <div className="mb-4">
                    <Form.Input
                      className="bg-white"
                      name={`targetings.value`}
                      label="Value"
                      required
                      defaultValue={targeting?.value}
                      fullWidth
                    />
                  </div>
                  <div className="mb-4">
                    <Form.Input
                      name={`targetings.appVersion`}
                      className="bg-white"
                      label="App version"
                      defaultValue={targeting?.appVersion}
                      fullWidth
                    />
                  </div>
                  <div className="mb-4">
                    <Form.Input
                      name={`targetings.percentile`}
                      className="bg-white"
                      label="User in percentile"
                      defaultValue={targeting?.percentile}
                      fullWidth
                    />
                  </div>
                  <div className="mb-4">
                    <Form.Input
                      name={`targetings.segment`}
                      className="bg-white"
                      label="Segment"
                      defaultValue={targeting?.segment}
                      fullWidth
                    />
                  </div>
                  <div className="text-center">
                    <Button
                      className="p-0 text-pink-50 hover:text-primary"
                      styled={false}
                      type="button"
                      onClick={() => setDeleted({ ...deleted, [i]: true })}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )
          )}
          <Button
            as="div"
            styled={false}
            className="border-dotted border-gray-80 border-4 rounded flex flex-auto items-center justify-center"
            style={{
              minWidth: "49%",
              maxWidth: "49%",
              minHeight: "329px",
              marginBottom: "2%",
            }}
            onClick={() => setTargetings([...targetings, {}])}
          >
            <span className="fas fa-plus text-6xl" />
          </Button>
        </div>
        {error && (
          <InfoBox className="mt-8" type={InfoBox.ERROR}>
            {error}
          </InfoBox>
        )}
        <div className="flex justify-center items-center mt-8">
          <Button secondary onClick={() => toggleModal(false)}>
            Cancel
          </Button>
          <Button primary className="ml-4" loading={loading}>
            {parameter ? "Update" : "Create"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

ParameterModal.propTypes = {
  isOpen: PropTypes.bool,
  toggleModal: PropTypes.func,
  config: PropTypes.object, // The whole remote-config object
  parameter: PropTypes.object, // The parameter that is being updated (if any)
  environment: PropTypes.object,
  api: PropTypes.object,
  app: PropTypes.object,
  history: PropTypes.object,
};

export default Object.assign(
  connect(withRouter(ParameterModal), [
    { Context: ModalContext, props: ["toggleModal", "isOpen"] },
    { Context: RootContext, props: ["api"] },
    { Context: AppContext, props: ["app"] },
    { Context: EnvironmentContext, props: ["environment"] },
  ]),
  ModalContext
);
