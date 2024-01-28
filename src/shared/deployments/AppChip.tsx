import type { SxProps } from "@mui/material";
import React from "react";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Dot from "~/components/Dot";
import githubLogo from "~/assets/logos/github-logo.svg";
import bitbucketLogo from "~/assets/logos/bitbucket-logo.svg";
import gitlabLogo from "~/assets/logos/gitlab-logo.svg";

const logos: Record<string, string> = {
  github: githubLogo,
  gitlab: gitlabLogo,
  bitbucket: bitbucketLogo,
};

interface Props {
  sx?: SxProps;
  children?: React.ReactNode;
  deployment: DeploymentV2;
  color?: "secondary" | "info";
}

export default function AppChip({ children, deployment, color, sx }: Props) {
  const pieces = deployment.repo.split("/");
  const provider = pieces.shift();
  const repo = pieces.join("/");

  return (
    <Chip
      color={color}
      label={
        <>
          {children && (
            <>
              {children}
              <Dot />
            </>
          )}
          {repo} <Dot /> {deployment.envName}
        </>
      }
      sx={color ? sx : { bgcolor: "#1F1C3B", color: "white", ...sx }}
      avatar={<Avatar src={logos[provider!]} />}
    />
  );
}
