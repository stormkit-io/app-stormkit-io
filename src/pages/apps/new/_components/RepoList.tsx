import type { Repo } from "../types.d";
import React, { useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import SearchIcon from "@mui/icons-material/Search";
import { useSelectedTeam } from "~/layouts/TopMenu/Teams/actions";
import { AuthContext } from "~/pages/auth/Auth.context";
import Form from "~/components/FormV2";
import Button from "~/components/ButtonV2";
import Spinner from "~/components/Spinner";
import githubLogo from "~/assets/logos/github-logo.svg";
import bitbucketLogo from "~/assets/logos/bitbucket-logo.svg";
import gitlabLogo from "~/assets/logos/gitlab-logo.svg";
import { insertRepo } from "./actions";

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

const RepoList: React.FC<Props> = ({
  repositories,
  provider,
  loading,
  isLoadingMore,
  error,
  hasNextPage,
  onNextPage,
}) => {
  const [filter, setFilter] = useState<string>();
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
      {repos.length > 0 && !loading && (
        <Form.Input
          fullWidth
          variant="filled"
          placeholder={"Filter repos by name"}
          sx={{ mb: 2 }}
          onChange={e => {
            clearTimeout(filterTimer);
            filterTimer = setTimeout(() => {
              setFilter(e.target.value);
            }, 250);
          }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ width: 24 }} />,
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

      {!loading && (
        <TransitionGroup>
          {repos.map(r => (
            <CSSTransition
              timeout={350}
              classNames="fade-in"
              unmountOnExit
              appear
              key={r.name}
            >
              <div
                className="flex px-3 py-6 mb-4 bg-blue-10 w-full cursor-pointer hover:bg-black transition-colors items-center"
                aria-label={r.name}
                tabIndex={0}
                role="button"
                onKeyPress={e => {
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
                <div>
                  <Button
                    styled={false}
                    category="link"
                    loading={loadingInsert === r.fullName}
                  >
                    <span className="uppercase text-xs font-bold">import</span>
                    <span className="fas fa-chevron-right text-base ml-2" />
                  </Button>
                </div>
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      )}
      {hasNextPage && (
        <div className="text-center mt-4">
          <Button
            category="action"
            loading={isLoadingMore}
            onClick={onNextPage}
          >
            Load more
          </Button>
        </div>
      )}
    </>
  );
};

export default RepoList;
