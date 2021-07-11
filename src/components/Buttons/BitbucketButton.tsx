import React from "react";
import ProviderButton, { OmittedProps } from "./_components/ProviderButton";

const BitbucketButton = (props: OmittedProps): React.ReactElement => {
  return <ProviderButton {...props} provider="bitbucket" text="Bitbucket" />;
};

export default BitbucketButton;
