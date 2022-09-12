import React from "react";
import githubLogo from "~/assets/logos/github-logo.svg";
import bitbucketLogo from "~/assets/logos/bitbucket-logo.svg";
import gitlabLogo from "~/assets/logos/gitlab-logo.svg";

interface Props {
  app: App;
  imageWidth?: 6 | 7 | 8;
  withDisplayName?: boolean;
}

const AppName: React.FC<Props> = ({ app, withDisplayName, imageWidth = 8 }) => {
  const pieces = app.repo.split("/") || [];
  const provider = pieces.shift() as Provider;
  const nameWithoutPrefix = pieces.join("/");
  const logo =
    provider === "github"
      ? githubLogo
      : provider === "gitlab"
      ? gitlabLogo
      : bitbucketLogo;

  return (
    <div className="flex items-center">
      <div className={`inline-block mr-2 w-${imageWidth}`}>
        <img src={logo} className="w-full" alt={provider} />
      </div>
      <div className="leading-4">
        {nameWithoutPrefix}
        {withDisplayName && (
          <div className="text-xs text-gray-60">{app.displayName}</div>
        )}
      </div>
    </div>
  );
};

export default AppName;
