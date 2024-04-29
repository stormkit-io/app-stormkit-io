import { useState, useContext, useEffect } from "react";
import { AuthContext } from "~/pages/auth/Auth.context";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Typography from "@mui/material/Typography";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import openPopup from "~/utils/helpers/popup";
import RepoList from "../_components/RepoList";
import Accounts from "../_components/Accounts";
import { useFetchAccounts, useFetchRepos } from "./actions";

const githubAccount = process.env.GITHUB_ACCOUNT || "stormkit-io";
const openPopupURL = `https://github.com/apps/${githubAccount}/installations/new`;

export default function NewGithubApp() {
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
    <Box maxWidth="md" sx={{ width: "100%" }}>
      <Card
        sx={{
          width: "100%",
          color: "white",
          mb: 4,
        }}
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
              sx={{
                display: "inline-flex",
                alignItems: "center",
                color: "white",
              }}
              href="/"
            >
              <ArrowBack sx={{ mr: 1 }} />
              Import from GitHub
            </Link>
          </Typography>
        </CardHeader>
        <Box>
          {!faLoading && accounts?.length > 0 && (
            <Accounts
              accounts={accounts}
              selected={installationId}
              onAccountChange={id => {
                setPage(1);
                setInstallationId(id);
              }}
            />
          )}

          {!faLoading && accounts?.length === 0 && (
            <Alert color="info" sx={{ mb: repos?.length > 0 ? 2 : 0 }}>
              <AlertTitle>No connected accounts found</AlertTitle>
              <Typography>
                Click on "Connect More Repositories" to import from GitHub.
              </Typography>
            </Alert>
          )}

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
      </Card>
    </Box>
  );
}
