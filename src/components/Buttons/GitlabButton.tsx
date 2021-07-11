import React from "react";
import ProviderButton, { OmittedProps } from "./_components/ProviderButton";

const GitlabButton = (props: OmittedProps): React.ReactElement => {
  return <ProviderButton {...props} provider="gitlab" text="GitLab" />;
};

export default GitlabButton;
