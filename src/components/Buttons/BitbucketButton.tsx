import React from "react";
import ProviderButton, { OmittedProps } from "./_components/ProviderButton";
import bitbucketLogo from "~/assets/logos/bitbucket-logo.svg";

const BitbucketButton = (props: OmittedProps): React.ReactElement => {
  return <ProviderButton {...props} logo={bitbucketLogo} text="Bitbucket" />;
};

export default BitbucketButton;
