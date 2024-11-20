import { useState, useContext, useEffect, useMemo } from "react";
import { AuthContext } from "~/pages/auth/Auth.context";
import { useFetchInstanceDetails } from "~/pages/auth/actions";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import openPopup from "~/utils/helpers/popup";
import RepoList from "../_components/RepoList";
import Accounts from "../_components/Accounts";
import { useFetchAccounts, useFetchRepos } from "./actions";

export default function NewGithubApp() {
  const { user } = useContext(AuthContext);
  const { details, loading: detailsLoading } = useFetchInstanceDetails();
  const { githubAccount, openPopupURL } = useMemo(() => {
    const githubAccount = details?.auth?.github || process.env.GITHUB_ACCOUNT;
    const openPopupURL = `https://github.com/apps/${githubAccount}/installations/new`;
    return { githubAccount, openPopupURL };
  }, [details?.auth, detailsLoading]);
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
    <Box maxWidth="md" sx={{ width: "100%", margin: "0 auto" }}>
      <Card
        sx={{ width: "100%", mb: 4 }}
        loading={loading}
        info={
          accounts?.length === 0 ? (
            <>
              <Typography>No connected accounts found</Typography>
              <Typography>
                Click on "Connect More Repositories" to import from GitHub.
              </Typography>
            </>
          ) : (
            ""
          )
        }
        error={
          !githubAccount && !detailsLoading
            ? "You don't seem to have a GITHUB_ACCOUNT configured."
            : ""
        }
      >
        <CardHeader
          actions={
            <Button
              color="secondary"
              variant="contained"
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
              <Box
                component="span"
                sx={{ display: { xs: "none", md: "inline-block" } }}
              >
                Connect more repositories
              </Box>
              <Box
                component="span"
                sx={{ display: { xs: "inline-block", md: "none" } }}
              >
                More repos
              </Box>
            </Button>
          }
        >
          <Typography>
            <Link
              sx={{ display: "inline-flex", alignItems: "center" }}
              href="/"
            >
              <ArrowBack sx={{ mr: 1 }} />
              Import from GitHub
            </Link>
          </Typography>
        </CardHeader>
        <Box>
          {accounts?.length > 0 && (
            <Accounts
              accounts={accounts}
              selected={installationId}
              onAccountChange={id => {
                setPage(1);
                setInstallationId(id);
              }}
            />
          )}

          <Box sx={{ mb: !githubAccount ? 4 : 0 }}>
            <RepoList
              repositories={repos}
              provider="github"
              loading={loading}
              error={error}
              isLoadingMore={isLoadingMore}
              hasNextPage={hasNextPage}
              onNextPage={() => setPage(page + 1)}
            />
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
