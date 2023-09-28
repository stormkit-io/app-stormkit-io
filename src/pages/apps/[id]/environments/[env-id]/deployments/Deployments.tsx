import { useContext } from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import InfoBox from "~/components/InfoBoxV2";
import Spinner from "~/components/Spinner";
import EmptyPage from "~/components/EmptyPage";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import { deployNow } from "~/utils/helpers/deployments";
import { timeSince } from "~/utils/helpers/date";
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
        <EmptyPage>
          It's quite empty in here. <br />
          <Link href="#" onClick={deployNow} sx={{ fontWeight: "bold" }}>
            Deploy now
          </Link>{" "}
          to start hosting your website.
        </EmptyPage>
      )}
    </Box>
  );
}
