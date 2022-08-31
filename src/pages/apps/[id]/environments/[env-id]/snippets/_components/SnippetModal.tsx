import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "~/pages/apps/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import Modal from "~/components/Modal";
import Form from "~/components/Form";
import InfoBox from "~/components/InfoBox";
import Button from "~/components/Button";
import { upsertSnippets } from "../actions";
import { html } from "@codemirror/lang-html";

interface Props {
  snippet?: Snippet;
  snippets: Snippets;
  closeModal: () => void;
  setSnippets: (snippets: Snippets) => void;
}

const SnippetModal: React.FC<Props> = ({
  closeModal,
  snippets,
  snippet,
  setSnippets,
}): React.ReactElement => {
  const isSnippetEnabled = snippet?.enabled || false;
  const isSnippetPrepend = snippet?.prepend || false;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(isSnippetEnabled);
  const [isPrepend, setIsPrepend] = useState(isSnippetPrepend);
  const [codeContent, setCodeContent] = useState(snippet?.content || "");
  const { app } = useContext(AppContext);
  const { environment } = useContext(EnvironmentContext);

  useEffect(() => {
    setIsEnabled(isSnippetEnabled);
    setIsPrepend(isSnippetPrepend);
  }, [isSnippetEnabled, isSnippetPrepend]);

  return (
    <Modal isOpen onClose={closeModal} className="max-w-screen-md">
      <h2 className="mb-8 text-xl font-bold">
        {snippet?.title ? "Edit snippet" : "Create snippet"}
      </h2>
      <Form
        handleSubmit={upsertSnippets({
          app,
          environment,
          snippets,
          setError,
          setLoading,
          setSnippets,
          isEnabled,
          isPrepend,
          closeModal,
          injectLocation: snippet?._injectLocation,
          index: snippet?._i,
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
        <div>
          <input name="content" type="hidden" value={codeContent} />
        </div>
        <div className="mb-8 p-4 rounded bg-gray-85">
          <Form.Code
            height="200px"
            className="bg-white p-4"
            value={snippet?.content}
            extensions={[html()]}
            onChange={value => setCodeContent(value)}
            theme="light"
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
              onSelect={() => {}}
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
          <Button secondary onClick={closeModal}>
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

export default SnippetModal;
