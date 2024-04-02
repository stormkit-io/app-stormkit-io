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
  repo: string;
  sx?: SxProps;
  children?: React.ReactNode;
  envName?: string;
  color?: "secondary" | "info";
}

export default function AppChip({
  children,
  repo: repoNameWithProvider,
  envName,
  color,
  sx,
}: Props) {
  const pieces = repoNameWithProvider?.split("/") || [];
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
          {repo} <Dot /> {envName}
        </>
      }
      sx={color ? sx : { bgcolor: "#1F1C3B", color: "white", ...sx }}
      avatar={<Avatar src={logos[provider!]} />}
    />
  );
}
