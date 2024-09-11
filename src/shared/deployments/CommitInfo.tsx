import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import AltRoute from "@mui/icons-material/AltRoute";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Dot from "~/components/Dot";
import Sha from "./Sha";
import AppChip from "./AppChip";

interface Props {
  deployment: DeploymentV2;
  showProject?: boolean;
  clickable?: boolean;
}

const defaultMessage = (deployment: DeploymentV2): React.ReactNode => {
  if (deployment.status === "running") {
    return <>Spinning up a worker...</>;
  }

  if (deployment.status === "success") {
    return `#${deployment.id}`;
  }

  if (deployment.stoppedManually) {
    return <>Deployment was stopped manually</>;
  }

  return (
    <>
      Deployment failed <br />
      Stormkit has no access to the repo or the branch does not exist.
    </>
  );
};

const author = (author?: string) => {
  if (!author) {
    return <></>;
  }

  return <>by {author.split("<")[0].trim()}</>;
};

export default function CommitInfo({
  deployment,
  showProject,
  clickable = true,
}: Props) {
  const message =
    deployment.commit?.message?.split("\n")[0] || defaultMessage(deployment);

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "baseline",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {clickable ? (
            <Link href={deployment.detailsUrl}>{message}</Link>
          ) : (
            <Typography>{message}</Typography>
          )}
          {deployment.published?.length > 0 && (
            <Chip
              color={deployment.published.length ? "success" : "info"}
              label={
                deployment.published.length
                  ? `published: ${deployment.published[0].percentage}%`
                  : "not published"
              }
              size="small"
              sx={{
                ml: 1,
                fontSize: 11,
                height: 20,
                lineHeight: 1,
              }}
            />
          )}
        </Box>

        <Typography
          sx={{
            display: "flex",
            alignItems: "baseline",
            color: "text.secondary",
            fontSize: 12,
            my: 0.5,
          }}
        >
          <Box component="span">
            <AltRoute sx={{ fontSize: 11, mr: 0.5 }} />
            {deployment.branch}
            {deployment.commit.sha && (
              <>
                <Dot />
                <Sha
                  repo={deployment.repo}
                  provider={deployment.repo.split("/")[0] as Provider}
                  sha={deployment.commit.sha}
                />
              </>
            )}
          </Box>
          {deployment.commit.author && (
            <>
              <Dot />
              <Box component="span">{author(deployment.commit.author)}</Box>
            </>
          )}
          {showProject && (
            <>
              <Dot />
              <Tooltip
                arrow
                placement="right"
                componentsProps={{
                  arrow: {
                    sx: {
                      color: "#1F1C3B",
                      left: "2px !important",
                    },
                  },
                  tooltip: {
                    sx: {
                      p: 0,
                      bgcolor: "transparent !important",
                      border: "none",
                    },
                  },
                }}
                title={
                  <AppChip
                    repo={deployment.repo}
                    envName={deployment.envName}
                  />
                }
              >
                <Link
                  href={`/apps/${deployment.appId}/environments/${deployment.envId}/deployments`}
                  sx={{ color: "text.secondary" }}
                >
                  {deployment.displayName}
                </Link>
              </Tooltip>
            </>
          )}
        </Typography>
      </Box>
    </Box>
  );
}
