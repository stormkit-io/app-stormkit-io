import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "~/pages/auth/Auth.context";
import { BackButton } from "~/components/Buttons";
import Button from "~/components/ButtonV2";
import Container from "~/components/Container";
import openPopup from "~/utils/helpers/popup";
import RepoList from "../_components/RepoList";
import Accounts from "../_components/Accounts";
import { useFetchAccounts, useFetchRepos } from "./actions";

const githubAccount =
  process.env.STORMKIT_ENV === "production" ? "stormkit-io" : "stormkit-io-dev";

const openPopupURL = `https://github.com/apps/${githubAccount}/installations/new`;

const Provider: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [refreshToken, setRefreshToken] = useState<number>();
  const [installationId, setInstallationId] = useState<string>();
  const {
    accounts,
    error: faError,
    loading: faLoading,
  } = useFetchAccounts({ refreshToken });

  const {
    repos,
    hasNextPage,
    error: frError,
    loading: frLoading,
    isLoadingMore,
  } = useFetchRepos({ installationId, page });

  const error = faError || frError;
  const loading = faLoading || frLoading;

  useEffect(() => {
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i]?.login === user?.displayName) {
        setInstallationId(accounts[i].id);
        break;
      }

      // If there is no match between current user display name and
      // the accounts, then select the first one.
      // Why we have this?
      // If you're invited as a member to other repos, and they are also
      // using stormkit, github might return other accounts first. So instead
      // of seeing repos from your individual account first, you see other people's repositories.
      // To prevent this, above we check that displayName === account.login. If nothing matches we
      // select the first one.
      if (accounts[0]) {
        setInstallationId(accounts[0].id);
      }
    }
  }, [accounts, user?.displayName]);

  return (
    <Container
      className="flex-1"
      title={
        <>
          <BackButton to="/" className="ml-0 mr-2" /> Import app from GitHub
        </>
      }
      actions={
        <Button
          category="action"
          onClick={() => {
            openPopup({
              url: openPopupURL,
              title: "Add repository",
              width: 1000,
              onClose: () => {
                setInstallationId(undefined);
                setRefreshToken(Date.now());
              },
            });
          }}
        >
          <span className="hidden md:inline-block">
            Connect more repositories
          </span>
          <span className="md:hidden">More repos</span>
        </Button>
      }
    >
      <div className="p-4 pt-0">
        <div className="flex mb-4">
          <Accounts
            loading={faLoading}
            accounts={accounts}
            selected={installationId}
            onAccountChange={id => {
              setPage(1);
              setInstallationId(id);
            }}
          />
        </div>

        <RepoList
          repositories={repos}
          provider="github"
          error={error}
          loading={loading}
          isLoadingMore={isLoadingMore}
          hasNextPage={hasNextPage}
          onNextPage={() => setPage(page + 1)}
        />
      </div>
    </Container>
  );
};

export default Provider;
