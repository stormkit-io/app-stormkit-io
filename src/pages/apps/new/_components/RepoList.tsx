import type { Repo } from "../types.d";
import { useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/lab/LoadingButton";
import SearchIcon from "@mui/icons-material/Search";
import { useSelectedTeam } from "~/layouts/TopMenu/Teams/actions";
import { AuthContext } from "~/pages/auth/Auth.context";
import Spinner from "~/components/Spinner";
import githubLogo from "~/assets/logos/github-logo.svg";
import bitbucketLogo from "~/assets/logos/bitbucket-logo.svg";
import gitlabLogo from "~/assets/logos/gitlab-logo.svg";
import { insertRepo } from "./actions";
import { grey } from "@mui/material/colors";

const logos: Record<Provider, string> = {
  github: githubLogo,
  bitbucket: bitbucketLogo,
  gitlab: gitlabLogo,
};

export interface Props {
  repositories: Repo[];
  provider: Provider;
  loading: boolean;
  isLoadingMore: boolean;
  error?: string;
  hasNextPage: boolean;
  onNextPage: () => void;
}

let filterTimer: NodeJS.Timeout;

export default function RepoList({
  repositories,
  provider,
  loading,
  isLoadingMore,
  error,
  hasNextPage,
  onNextPage,
}: Props) {
  const [filter, setFilter] = useState<string>("");
  const [loadingInsert, setLoadingInsert] = useState("");
  const { teams } = useContext(AuthContext);
  const team = useSelectedTeam({ teams });
  const navigate = useNavigate();
  const logo = logos[provider];
  const repos = useMemo<Repo[]>(
    () => repositories.filter(r => !filter || r.name.includes(filter)),
    [repositories, filter]
  );

  const handleRepoInsert = (r: Repo) => {
    setLoadingInsert(r.fullName);
    insertRepo({
      repo: r.fullName,
      provider,
      teamId: team?.id,
    })
      .then(app => {
        navigate(`/apps/${app.id}`);
      })
      .finally(() => {
        setLoadingInsert("");
      });
  };

  return (
    <>
      {((repos.length > 0 && !loading) || filter) && (
        <TextField
          fullWidth
          label="Filter repos"
          variant="filled"
          placeholder="Filter repos by name"
          sx={{ mb: 2 }}
          onChange={e => {
            setFilter(e.target.value);
            clearTimeout(filterTimer);
            filterTimer = setTimeout(() => {
              setFilter(e.target.value);
            }, 250);
          }}
          InputLabelProps={{
            sx: {
              pl: 1,
            },
          }}
          InputProps={{
            sx: {
              pl: 0.75,
            },
            endAdornment: <SearchIcon sx={{ width: 24 }} />,
          }}
        />
      )}

      {loading && (
        <div
          className="flex w-full justify-center mt-4"
          data-testid="repo-list-spinner"
        >
          <Spinner primary />
        </div>
      )}

      {!loading &&
        repos.map(r => (
          <Box
            key={r.fullName}
            sx={{
              display: "flex",
              alignItems: "center",
              px: 2,
              pr: 1,
              py: 1,
              borderBottom: `1px solid ${grey[900]}`,
              ":hover": {
                bgcolor: "rgba(255,255,255,0.05)",
              },
              ":last-child": {
                borderBottom: "none",
              },
            }}
            aria-label={r.name}
            tabIndex={0}
            role="button"
            onKeyUp={e => {
              if (e.key === "Enter") {
                handleRepoInsert(r);
              }
            }}
            onClick={() => {
              handleRepoInsert(r);
            }}
          >
            <div className="inline-block mr-2 w-5">
              <img src={logo} className="w-full" alt={provider} />
            </div>
            <div className="flex-1 leading-4">{r.name}</div>
            <Box>
              <Button
                variant="text"
                color="info"
                loading={loadingInsert === r.fullName}
              >
                <span className="uppercase text-xs font-bold">import</span>
                <span className="fas fa-chevron-right text-base ml-2" />
              </Button>
            </Box>
          </Box>
        ))}
      {hasNextPage && repos.length > 0 && (
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Button
            variant="contained"
            color="secondary"
            loading={isLoadingMore}
            onClick={onNextPage}
          >
            Load more
          </Button>
        </Box>
      )}
    </>
  );
}
