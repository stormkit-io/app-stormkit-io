import React, { useState, useContext } from "react";
import { useLocation } from "react-router";
import { Tooltip } from "@mui/material";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import Spinner from "~/components/Spinner";
import Button from "~/components/ButtonV2";
import InfoBox from "~/components/InfoBoxV2";
import DotDotDot from "~/components/DotDotDotV2";
import ConfirmModal from "~/components/ConfirmModal";
import Form from "~/components/FormV2";
import Link from "~/components/Link";
import Container from "~/components/Container";
import emptyListSvg from "~/assets/images/empty-list.svg";
import { useFetchSnippets, deleteSnippet, enableOrDisable } from "./actions";
import SnippetModal from "./_components/SnippetModal";

interface RenderSnippetProps {
  snippet: Snippet;
  snippets: Snippets;
  setToBeDeleted: (s?: Snippet) => void;
  setToBeModified: (s?: Snippet) => void;
  setToBeToggled: (s?: Snippet) => void;
  setIsSnippetModalOpen: (v: boolean) => void;
}

const renderSnippet = ({
  snippet,
  snippets,
  setToBeDeleted,
  setToBeModified,
  setToBeToggled,
  setIsSnippetModalOpen,
}: RenderSnippetProps) => {
  return (
    <div
      key={`${snippet.title}${snippet._i}`}
      className="flex bg-blue-10 p-4 justify-between mt-4"
    >
      <div className="flex-1">
        <div className="font-bold">{snippet.title}</div>
        <div className="text-xs">
          <span className="font-bold">
            {snippet.prepend ? "Prepended" : "Appended"}
          </span>{" "}
          to the <span className="font-bold">{snippet._injectLocation}</span>{" "}
          element.
        </div>
      </div>
      <div className="flex items-center">
        <Form.Switch
          className="mr-4"
          checked={snippet.enabled}
          onChange={() => setToBeToggled(snippet)}
        />
        <DotDotDot
          items={[
            {
              icon: "fa fa-pencil",
              text: "Modify",
              onClick: () => {
                setToBeDeleted(undefined);
                setToBeToggled(undefined);
                setToBeModified(snippet);
                setIsSnippetModalOpen(true);
              },
            },
            {
              icon: "fa fa-times",
              text: "Delete",
              onClick: () => {
                setToBeModified(undefined);
                setToBeToggled(undefined);
                setToBeDeleted(snippet);
              },
            },
          ]}
        />
      </div>
    </div>
  );
};

const Snippets: React.FC = (): React.ReactElement => {
  const { app } = useContext(AppContext);
  const { environment: env } = useContext(EnvironmentContext);
  const location = useLocation();
  const fetchOpts = { app, env, location };
  const { loading, error, snippets, setSnippets } = useFetchSnippets(fetchOpts);
  const [isSnippetModalOpen, setIsSnippetModalOpen] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState<Snippet | undefined>();
  const [toBeToggled, setToBeToggled] = useState<Snippet | undefined>();
  const [toBeModified, setToBeModified] = useState<Snippet | undefined>();

  return (
    <Container
      maxWidth="max-w-none"
      title={
        <Tooltip
          arrow
          title={
            <p>
              Snippets help you maintain 3rd party code in your application.{" "}
              <br />
              <br />
              The codes specified here will be injected during response time to
              your document. You can enable or disable any snippet without the
              need of a deployment.
            </p>
          }
        >
          <span>
            Snippets <span className="fas fa-question-circle" />
          </span>
        </Tooltip>
      }
      actions={
        <Button
          type="button"
          category="button"
          onClick={() => {
            setIsSnippetModalOpen(true);
          }}
        >
          New snippet
        </Button>
      }
    >
      <div className="w-full pb-4">
        {loading && (
          <div className="flex justify-center">
            <Spinner primary />
          </div>
        )}
        {!loading && error && (
          <InfoBox type={InfoBox.ERROR} className="mx-4">
            {error}
          </InfoBox>
        )}
        {!loading &&
          snippets &&
          (snippets.head.length > 0 || snippets.body.length > 0) && (
            <div className="w-full relative px-4">
              <h3 className="font-bold mb-4">Head section</h3>
              {snippets.head.map((snippet, i) =>
                renderSnippet({
                  snippet,
                  snippets,
                  setToBeDeleted,
                  setToBeModified,
                  setToBeToggled,
                  setIsSnippetModalOpen,
                })
              )}
              {snippets.head.length === 0 && (
                <div className="bg-blue-10 p-4">
                  No snippet found for the head section.
                </div>
              )}
              <h3 className="font-bold mt-4">Body section</h3>
              {snippets.body.map((snippet, i) =>
                renderSnippet({
                  snippet,
                  snippets,
                  setToBeDeleted,
                  setToBeModified,
                  setToBeToggled,
                  setIsSnippetModalOpen,
                })
              )}
              {snippets.body.length === 0 && (
                <div className="bg-blue-10 p-4 mt-4">
                  No snippet found for the body section.
                </div>
              )}
            </div>
          )}
        {!loading && !snippets?.body?.length && !snippets?.head?.length && (
          <div className="p-4 flex items-center justify-center flex-col">
            <p className="mt-8">
              <img src={emptyListSvg} alt="Snippets empty list" />
            </p>
            <p className="mt-12">It is quite empty here.</p>
            <p>
              <Link
                to="https://www.stormkit.io/docs/features/snippets"
                secondary
              >
                Learn more
              </Link>{" "}
              about snippets.
            </p>
          </div>
        )}
        {isSnippetModalOpen && snippets && (
          <SnippetModal
            snippets={snippets}
            setSnippets={setSnippets}
            snippet={toBeModified}
            closeModal={() => {
              setToBeModified(undefined);
              setIsSnippetModalOpen(false);
            }}
          />
        )}
        {toBeToggled && snippets && (
          <ConfirmModal
            onCancel={() => {
              setToBeToggled(undefined);
            }}
            onConfirm={({ setError, setLoading }) => {
              setLoading(true);
              enableOrDisable({
                app,
                environment: env,
                snippets,
                index: toBeToggled._i,
                isEnabled: !toBeToggled.enabled,
                snippet: toBeToggled,
              })
                .then(snippets => {
                  setSnippets(snippets);
                  setToBeToggled(undefined);
                })
                .catch(res => {
                  if (typeof res === "string") {
                    setError(res);
                  } else {
                    setError("Something went wrong while deleting snippet.");
                  }
                })
                .finally(() => {
                  setLoading(false);
                });
            }}
          >
            <p>
              This will{" "}
              <span className="font-bold">
                {toBeToggled.enabled ? "disable" : "enable"}
              </span>{" "}
              the snippet. Changes will be effective immediately.
            </p>
          </ConfirmModal>
        )}
        {toBeDeleted && snippets && (
          <ConfirmModal
            onCancel={() => {
              setToBeDeleted(undefined);
            }}
            onConfirm={({ setError, setLoading }) => {
              setLoading(true);
              deleteSnippet({
                index: toBeDeleted._i,
                snippets,
                app,
                environment: env,
                injectLocation: toBeDeleted._injectLocation,
              })
                .then(snippets => {
                  setSnippets(snippets);
                  setToBeDeleted(undefined);
                })
                .catch(res => {
                  if (typeof res === "string") {
                    setError(res);
                  } else {
                    setError("Something went wrong while deleting snippet.");
                  }
                })
                .finally(() => {
                  setLoading(false);
                });
            }}
          >
            <p>
              This will delete the snippet and it won't be injected anymore.
            </p>
          </ConfirmModal>
        )}
      </div>
    </Container>
  );
};

export default Snippets;
