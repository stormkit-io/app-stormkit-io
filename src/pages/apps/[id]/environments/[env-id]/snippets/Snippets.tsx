import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import Tooltip from "@material-ui/core/Tooltip";
import { connect } from "~/utils/context";
import Api from "~/utils/api/Api";
import RootContext from "~/pages/Root.context";
import AppContext from "~/pages/apps/App.context";
import EnvironmentContext from "~/pages/apps/[id]/environments/[env-id]/Environment.context";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBox";
import { ModalContextProps } from "~/components/Modal";
import { PlusButton } from "~/components/Buttons";
import { useFetchSnippets } from "./actions";
import SnippetModal from "./_components/SnippetModal";
import SnippetTable from "./_components/SnippetTable";

interface Props {
  api: Api;
  app: App;
  environment: Environment;
}

const Explanation = () => (
  <p>
    Snippets help you to maintain 3rd party code in your application. <br />{" "}
    <br />
    The codes specified here will be injected during response time to your
    document. You can enable or disable any snippet without the need of a
    deployment.
  </p>
);

const Snippets: React.FC<Props & ModalContextProps> = ({
  api,
  app,
  environment: env,
}): React.ReactElement => {
  const location = useLocation();
  const fetchOpts = { api, app, env, location };
  const { loading, error, snippets, setSnippets } = useFetchSnippets(fetchOpts);
  const [isSnippetModalOpen, setIsSnipperModalOpen] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | undefined>();

  useEffect(() => {
    setSelectedSnippet(undefined);
  }, [snippets]);

  return (
    <div className="flex flex-col mt-4">
      <div className="flex bg-white rounded mb-4 p-8 items-center">
        <h2 className="text-lg font-bold flex flex-auto items-center">
          Snippets
          <Tooltip title={<Explanation />} placement="top" arrow>
            <span className="fas fa-question-circle ml-2" />
          </Tooltip>
        </h2>
        <div className="flex-shrink-0">
          <PlusButton
            size="small"
            onClick={() => {
              setSelectedSnippet(undefined);
              setIsSnipperModalOpen(true);
            }}
            className="p-2 rounded"
            aria-label="Insert snippet"
          />
        </div>
      </div>
      <div className="flex flex-auto rounded">
        {loading && (
          <div
            data-testid="snippets-spinner"
            className="p-8 flex items-center w-full bg-white rounded"
          >
            <Spinner primary />
          </div>
        )}
        {!loading && error && <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>}
        {!loading && snippets && (
          <div className="w-full relative">
            {isSnippetModalOpen && (
              <SnippetModal
                snippets={snippets}
                setSnippets={setSnippets}
                snippet={selectedSnippet}
                closeModal={() => setIsSnipperModalOpen(false)}
              />
            )}
            <SnippetTable
              snippets={snippets}
              api={api}
              app={app}
              environment={env}
              setSnippets={setSnippets}
              setSelectedSnippet={(args: Snippet) => {
                setSelectedSnippet(args);
                setIsSnipperModalOpen(true);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default connect<Props, ModalContextProps>(Snippets, [
  { Context: RootContext, props: ["api"] },
  { Context: AppContext, props: ["app"] },
  { Context: EnvironmentContext, props: ["environment"] },
]);
