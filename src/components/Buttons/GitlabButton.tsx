import React from "react";
import ProviderButton, { OmittedProps } from "./_components/ProviderButton";
import gitlabLogo from "~/assets/logos/gitlab-logo.svg";

const GitlabButton = (props: OmittedProps): React.ReactElement => {
  return <ProviderButton {...props} logo={gitlabLogo} text="GitLab" />;
};

export default GitlabButton;
