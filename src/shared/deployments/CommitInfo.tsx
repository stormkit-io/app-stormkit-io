import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import AltRoute from "@mui/icons-material/AltRoute";
import Sha from "./Sha";
import ReleaseInfo from "./ReleaseInfo";
import { grey } from "@mui/material/colors";

interface Props {
  deployment: DeploymentV2;
  showNotPublishedInfo?: boolean;
  clickable?: boolean;
}

const defaultMessage = (deployment: DeploymentV2): React.ReactNode => {
  if (deployment.status === "running") {
    return "Spinning up a worker...";
  }

  return deployment.status === "success" ? (
    `#${deployment.id}`
  ) : (
    <>
      <div>Deployment failed.</div>
      <div>
        Stormkit has no access to the repo or the branch does not exist.
      </div>
    </>
  );
};

const author = (author?: string) => {
  if (!author) {
    return <></>;
  }

  return <>by {author.split("<")[0].trim()}</>;
};

const appName = (deployment: DeploymentV2) => {
  const pieces = deployment.repo.split("/");
  const provider = pieces.shift();

  return (
    <>
      <Box component="span">{pieces.join("/")}</Box>{" "}
      <Box component="span" sx={{ color: grey[500] }}>
        {"("}
        {deployment.displayName}
        {")"}
      </Box>
    </>
  );
};

export default function CommitInfo({
  deployment,
  showNotPublishedInfo,
  clickable = true,
}: Props) {
  const message =
    deployment.commit?.message?.split("\n")[0] || defaultMessage(deployment);

  return (
    <Box sx={{ flex: 1, display: "flex", alignItems: "baseline" }}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {clickable ? (
          <Link href={deployment.detailsUrl}>
            {appName(deployment)}
            <br /> {message}
          </Link>
        ) : (
          <Typography>{message}</Typography>
        )}
        <ReleaseInfo
          showNotPublishedInfo={deployment.exit === 0 && showNotPublishedInfo}
          percentage={
            0
            // deployment.published?.find(p => p.envId === environment?.id)
            //   ?.percentage ||
            // environment?.published?.find(p => p.deploymentId === deployment.id)
            //   ?.percentage
          }
        />
        {deployment.branch && deployment.commit.sha && (
          <Typography
            sx={{
              display: "flex",
              alignItems: "baseline",
              mt: 1,
              color: grey[500],
              fontSize: 12,
            }}
          >
            <Box component="span">
              <AltRoute sx={{ fontSize: 11, mr: 0.5 }} />
              {deployment.branch} {"("}
              <Sha
                repo={deployment.repo}
                provider={deployment.repo.split("/")[0] as Provider}
                sha={deployment.commit.sha}
              />
              {")"}
            </Box>
            <Box component="span" sx={{ mx: 1, opacity: 0.5 }}>
              |
            </Box>
            <Box>{author(deployment.commit.author)}</Box>
          </Typography>
        )}
      </Box>
    </Box>
  );
}
