import { useContext } from "react";
import Box from "@mui/material/Box";
import InfoBox from "~/components/InfoBoxV2";
import Spinner from "~/components/Spinner";
import Button from "~/components/ButtonV2";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import { deployNow } from "~/utils/helpers/deployments";
import { timeSince } from "~/utils/helpers/date";
import emptyListSvg from "~/assets/images/empty-list.svg";
import { useFetchDeployments } from "./actions";
import CommitInfo from "./_components/CommitInfo";
import DeploymentMenu from "./_components/DeploymentMenu";

export default function Deployments() {
  const { app, setRefreshToken } = useContext(AppContext);
  const { environment } = useContext(EnvironmentContext);
  const { deployments, loading, error } = useFetchDeployments({
    app,
    from: 0,
    filters: { envId: environment.id },
  });

  return (
    <Box>
      {loading && (
        <Box
          sx={{
            pt: 2,
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Spinner />
        </Box>
      )}
      {!loading && error && <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>}
      {!loading &&
        !error &&
        deployments.map((deployment, i) => (
          <Box
            key={deployment.id}
            sx={{
              bgcolor: "container.paper",
              p: 2,
              mb: 2,
              color: "white",
              display: "flex",
              "&:last-child": {
                mb: 0,
              },
              "&:hover": {
                transition: "all 0.25s ease-in",
              },
            }}
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
                {timeSince(deployment.createdAt * 1000)} ago
              </div>
            </div>
          </Box>
        ))}
      {!loading && !error && !deployments.length && (
        <div className="p-4 flex flex-col items-center justify-center">
          <img src={emptyListSvg} alt="No deployments" className="block mb-4" />
          <p className="mb-4">It is quite empty here.</p>
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
    </Box>
  );
}
