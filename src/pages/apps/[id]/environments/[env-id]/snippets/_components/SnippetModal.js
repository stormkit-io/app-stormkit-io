import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import RootContext from "~/pages/Root.context";
import AppContext from "~/pages/apps/App.context";
import EnvironmentContext from "~/pages/apps/[id]/environments/[env-id]/Environment.context";
import Modal from "~/components/Modal";
import Form from "~/components/Form";
import InfoBox from "~/components/InfoBox";
import Button from "~/components/Button";
import { connect } from "~/utils/context";
import { upsertSnippets } from "../actions";

const ModalContext = Modal.Context();

const SnippetModal = ({
  isOpen,
  toggleModal,
  snippets,
  snippet,
  api,
  app,
  environment,
  setSnippets
}) => {
  const isSnippetEnabled = snippet?.enabled || false;
  const isSnippetPrepend = snippet?.prepend || false;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(isSnippetEnabled);
  const [isPrepend, setIsPrepend] = useState(isSnippetPrepend);

  useEffect(() => {
    setIsEnabled(isSnippetEnabled);
    setIsPrepend(isSnippetPrepend);
  }, [isSnippetEnabled, isSnippetPrepend]);

  if (!isOpen) {
    return "";
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => toggleModal(false)}
      className="max-w-screen-md"
    >
      <h2 className="mb-8 text-xl font-bold">
        {snippet?.title ? "Edit snippet" : "Create snippet"}
      </h2>
      <Form
        handleSubmit={upsertSnippets({
          api,
          app,
          environment,
          snippets,
          setError,
          setLoading,
          setSnippets,
          isEnabled,
          isPrepend,
          toggleModal,
          injectLocation: snippet?._injectLocation,
          index: snippet?._i
        })}
      >
        <div className="mb-8 p-4 rounded bg-gray-85">
          <Form.Input
            name="title"
            label="Title"
            className="bg-white"
            required
            defaultValue={snippet?.title}
            fullWidth
          />
          <p className="opacity-50 text-sm pt-2">
            The snippet title that will be used internally.
          </p>
        </div>
        <div className="mb-8 p-4 rounded bg-gray-85">
          <Form.Input
            name="content"
            label="Content"
            className="bg-white"
            rows={10}
            rowsMax={15}
            multiline
            defaultValue={snippet?.content}
            fullWidth
          />
          <p className="opacity-50 text-sm pt-2">
            The content that will be injected to document on server response.
          </p>
        </div>
        <div className="flex flex-col mb-8 p-4 rounded bg-gray-85">
          <div className="flex">
            <Form.Toggler
              name="_injectLocation"
              className="mr-4"
              defaultSelected={
                snippet?._injectLocation === "body" ? "body" : "head"
              }
            >
              <div data-value="body">Body</div>
              <div data-value="head">Head</div>
            </Form.Toggler>
            <Form.Toggler
              name="_injectType"
              defaultSelected={isPrepend ? "prepend" : "append"}
              onSelect={value => setIsPrepend(value === "prepend")}
            >
              <div data-value="prepend">Prepend</div>
              <div data-value="append">Append</div>
            </Form.Toggler>
          </div>
          <p className="opacity-50 text-sm pt-2">
            The content that will be injected to document on server response.
          </p>
        </div>
        <div className="p-4 rounded bg-gray-85">
          <div>
            Enabled
            <Form.Switch
              className="ml-4"
              checked={isEnabled}
              onChange={e => setIsEnabled(e.target.checked)}
            />
          </div>
          <p className="opacity-50 text-sm pt-2">
            Whether the snippet is enabled or not. Changes take effect
            immediately.
          </p>
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
            {snippet ? "Update" : "Create"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

SnippetModal.propTypes = {
  isOpen: PropTypes.bool,
  toggleModal: PropTypes.func,
  snippet: PropTypes.object,
  snippets: PropTypes.object,
  setSnippets: PropTypes.func,
  environment: PropTypes.object,
  api: PropTypes.object,
  app: PropTypes.object
};

export default Object.assign(
  connect(withRouter(SnippetModal), [
    { Context: ModalContext, props: ["toggleModal", "isOpen"] },
    { Context: RootContext, props: ["api"] },
    { Context: AppContext, props: ["app"] },
    { Context: EnvironmentContext, props: ["environment"] }
  ]),
  ModalContext
);
