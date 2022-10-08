import React, { useContext } from "react";
import Container from "~/components/Container";
import InfoBox from "~/components/InfoBoxV2";
import Spinner from "~/components/Spinner";
import Button from "~/components/ButtonV2";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import { formattedDate, deployNow } from "~/utils/helpers/deployments";
import emptyListSvg from "~/assets/images/empty-list.svg";
import { useFetchDeployments } from "./actions";
import CommitInfo from "./_components/CommitInfo";
import DeploymentMenu from "./_components/DeploymentMenu";

const Deployments: React.FC = () => {
  const { app, setRefreshToken } = useContext(AppContext);
  const { environment } = useContext(EnvironmentContext);
  const { deployments, loading, error } = useFetchDeployments({
    app,
    from: 0,
    filters: { envId: environment.id },
  });

  return (
    <Container title="Deployments" maxWidth="max-w-none" className="pb-4">
      {loading && (
        <div className="pb-4 flex w-full justify-center">
          <Spinner />
        </div>
      )}
      {!loading && error && <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>}
      {!loading &&
        !error &&
        deployments.map(deployment => (
          <div
            className="bg-blue-10 mx-2 md:mx-4 mb-2 md:mb-4 p-4 flex text-sm"
            key={deployment.id}
          >
            <CommitInfo
              app={app}
              environment={environment}
              deployment={deployment}
              showStatus
            />
            <div className="flex flex-col items-end justify-between">
              <DeploymentMenu
                app={app}
                environment={environment}
                deployment={deployment}
                setRefreshToken={setRefreshToken}
              />
              <div className="text-xs">
                {formattedDate(deployment.createdAt)}
              </div>
            </div>
          </div>
        ))}
      {!loading && !error && !deployments.length && (
        <div className="p-4 flex flex-col items-center justify-center">
          <img src={emptyListSvg} alt="No deployments" className="block mb-4" />
          <p className="mb-4">It is quite empty in here.</p>
          <Button
            type="button"
            className="text-bold"
            onClick={deployNow}
            onKeyUp={deployNow}
          >
            Click to deploy
          </Button>
        </div>
      )}
    </Container>
  );
};

export default Deployments;
