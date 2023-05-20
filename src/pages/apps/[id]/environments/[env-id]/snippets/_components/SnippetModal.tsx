import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import Modal from "~/components/ModalV2";
import Form from "~/components/FormV2";
import InfoBox from "~/components/InfoBox";
import Button from "~/components/ButtonV2";
import { upsertSnippets } from "../actions";
import { html } from "@codemirror/lang-html";
import Container from "~/components/Container";

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
  const { app } = useContext(AppContext);
  const { environment } = useContext(EnvironmentContext);
  const isSnippetEnabled = snippet?.enabled || false;
  const isSnippetPrepend = snippet?.prepend || false;
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(isSnippetEnabled);
  const [isPrepend, setIsPrepend] = useState(isSnippetPrepend);
  const [codeContent, setCodeContent] = useState(
    snippet?.content || "<script>\n    console.log('Hello world');\n</script>"
  );

  useEffect(() => {
    setIsEnabled(isSnippetEnabled);
    setIsPrepend(isSnippetPrepend);
  }, [isSnippetEnabled, isSnippetPrepend]);

  return (
    <Modal open onClose={closeModal} className="max-w-screen-md">
      <Container title={snippet?.title ? "Edit snippet" : "Create snippet"}>
        <Form<Snippet>
          handleSubmit={values => {
            setLoading(true);
            setError(undefined);
            upsertSnippets({
              app,
              environment,
              snippets,
              isEnabled,
              isPrepend,
              injectLocation: snippet?._injectLocation,
              index: snippet?._i,
              values,
            })
              .then(snippets => {
                setSnippets(snippets);
                closeModal();
              })
              .catch(e => {
                if (typeof e === "string") {
                  setError(e);
                } else {
                  setError("Something went wrong while saving snippet.");
                }
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        >
          <Form.WithLabel label="Title" className="py-0">
            <Form.Input
              name="title"
              className="bg-blue-10 no-border h-full"
              placeholder="e.g. Google Analytics, Hotjar, My snippet"
              required
              defaultValue={snippet?.title}
              autoFocus
              fullWidth
            />
          </Form.WithLabel>
          <Form.WithLabel
            label={<div className="h-full pt-4">Content</div>}
            className="pb-0"
          >
            <input name="content" type="hidden" value={codeContent} />
            <div className="w-full p-1">
              <Form.Code
                minHeight="200px"
                maxHeight="200px"
                className="bg-blue-10 border-none"
                value={codeContent}
                extensions={[html()]}
                onChange={value => setCodeContent(value)}
                theme="dark"
              />
            </div>
          </Form.WithLabel>
          <Form.WithLabel label="Where to inject" className="pb-0">
            <Form.Select
              name="_injectLocation"
              defaultValue={`${snippet?._injectLocation || "head"}_${
                isSnippetPrepend ? "prepend" : "append"
              }`}
              background="transparent"
              textColor="gray-80"
              className="no-border h-full"
              onChange={e => {
                const val = e.target.value as string;
                console.log(val);
                setIsPrepend(val.indexOf("_prepend") > -1);
              }}
            >
              <Form.Option value="head_append">Append to Head</Form.Option>
              <Form.Option value="head_prepend">Prepend to Head</Form.Option>
              <Form.Option value="body_append">Append to Body</Form.Option>
              <Form.Option value="body_prepend">Prepend to Body</Form.Option>
            </Form.Select>
          </Form.WithLabel>
          <Form.WithLabel label="Enabled" className="pb-0">
            <div className="bg-blue-10 w-full flex justify-between pr-4 items-center">
              <Form.Switch
                color="secondary"
                checked={isEnabled}
                onChange={e => setIsEnabled(e.target.checked)}
              />
            </div>
          </Form.WithLabel>
          {error && (
            <InfoBox className="mt-8" type={InfoBox.ERROR}>
              {error}
            </InfoBox>
          )}
          <div className="flex justify-center items-center my-4">
            <Button
              category="cancel"
              className="bg-blue-20"
              type="button"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button category="action" className="ml-4" loading={loading}>
              {snippet ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Container>
    </Modal>
  );
};

export default SnippetModal;
