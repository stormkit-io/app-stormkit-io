import React from "react";
import ProviderButton, { Props } from "./_components/ProviderButton";

const GitlabButton = (props: Props): React.ReactElement => {
  return <ProviderButton {...props} provider="gitlab" text="GitLab" />;
};

export default GitlabButton;
