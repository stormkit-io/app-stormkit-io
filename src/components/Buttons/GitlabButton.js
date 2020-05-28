import React from "react";
import ProviderButton from "./_components/ProviderButton";

const GitlabButton = (props) => {
  return <ProviderButton {...props} provider="gitlab" text="GitLab" />;
};

export default GitlabButton;
