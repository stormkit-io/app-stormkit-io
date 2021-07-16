import React from "react";
import cn from "classnames";
import Link from "~/components/Link";
import { ModalContextProps } from "~/components/Modal";
import { connect } from "~/utils/context";
import PersonalAccessTokenModal from "./PersonalAccessTokenModal";

interface Props {
  accounts: Array<ConnectedAccount>;
}

const texts: Record<Provider, string> = {
  github: "GitHub",
  gitlab: "GitLab",
  bitbucket: "Bitbucket",
};

const ConnectedAccounts: React.FC<Props & ModalContextProps> = ({
  accounts,
  toggleModal,
}): React.ReactElement => {
  return (
    <div className="mt-12">
      <h2 className="font-bold text-lg">Connected Accounts</h2>
      <h3 className="font-light text-xs text-secondary mb-4">
        This is the list of connected providers. The primary email specified for
        the provider is used to combine these accounts.
      </h3>
      <div className="mb-4">
        {accounts.map(({ provider, hasPersonalAccessToken }, i) => (
          <div
            key={provider}
            className={cn("py-4 flex", {
              "border-b border-gray-200": i !== accounts.length - 1,
            })}
          >
            <span className="flex-auto flex items-center">
              <span className={`text-ml mr-2 fab fa-${provider}`} />
              {texts[provider]}
            </span>
            {provider === "gitlab" ? (
              <span>
                <Link
                  to="#"
                  tertiary
                  onClick={e => {
                    e.preventDefault();
                    toggleModal(true);
                  }}
                >
                  Set personal access token
                </Link>
                <PersonalAccessTokenModal hasToken={hasPersonalAccessToken} />
              </span>
            ) : undefined}
          </div>
        ))}
      </div>
    </div>
  );
};

export default connect<Props, ModalContextProps>(ConnectedAccounts, [
  { Context: PersonalAccessTokenModal, props: ["toggleModal"], wrap: true },
]);
