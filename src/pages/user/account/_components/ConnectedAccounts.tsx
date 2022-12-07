import React, { useState } from "react";
import cn from "classnames";
import Container from "~/components/Container";
import Link from "~/components/Link";
import PersonalAccessTokenModal from "./PersonalAccessTokenModal";

interface Props {
  accounts: Array<ConnectedAccount>;
}

const texts: Record<Provider, string> = {
  github: "GitHub",
  gitlab: "GitLab",
  bitbucket: "Bitbucket",
};

const showPersonalAccessButton = (provider: Provider): boolean => {
  return provider === "gitlab";
};

const ConnectedAccounts: React.FC<Props> = ({
  accounts,
}): React.ReactElement => {
  const [isOpen, toggleModal] = useState(false);

  return (
    <Container
      title="Connected Accounts"
      subtitle="This is the list of connected providers. The primary email specified for
    the provider is used to combine these accounts."
    >
      <div className="px-4 mb-4">
        {accounts.map(({ provider, hasPersonalAccessToken }, i) => (
          <div
            key={provider}
            data-testid={provider}
            className={cn("py-4 flex", {
              "border-b border-gray-200": i !== accounts.length - 1,
            })}
          >
            <span className="flex-auto flex items-center">
              <span className={`text-ml mr-2 fab fa-${provider}`} />
              {texts[provider]}
            </span>
            {showPersonalAccessButton(provider) ? (
              <span>
                <Link
                  to="#"
                  secondary
                  className="font-bold"
                  onClick={e => {
                    e.preventDefault();
                    toggleModal(true);
                  }}
                >
                  {hasPersonalAccessToken ? "Reset" : "Set"} personal access
                  token
                </Link>
                {isOpen && (
                  <PersonalAccessTokenModal
                    hasToken={hasPersonalAccessToken}
                    toggleModal={toggleModal}
                  />
                )}
              </span>
            ) : undefined}
          </div>
        ))}
      </div>
    </Container>
  );
};

export default ConnectedAccounts;
