import type { Installation, PageQueryParams } from "~/utils/api/Github";
import type { Repo, Account } from "../types.d";
import { useEffect, useState } from "react";
import githubApi from "~/utils/api/Github";

const errorMessage =
  "We were not able to fetch GitHub repositories. " +
  "Please make sure that we have enough permissions.";

const defaultPageQueryParams: PageQueryParams = {
  page: 1,
  per_page: 25,
};

const getAccounts = (installations: Installation[]): Account[] => {
  return installations.map((inst: any) => ({
    id: inst.id,
    login: inst.account.login,
    avatar: inst.account.avatar_url,
  }));
};

interface UseFetchRepoProps {
  page?: number;
  installationId?: string;
}

interface UseFetchReposReturnValue {
  loading: boolean;
  isLoadingMore: boolean;
  error?: string;
  repos: Repo[];
  hasNextPage: boolean;
}

export const useFetchRepos = ({
  installationId,
  page = 1,
}: UseFetchRepoProps): UseFetchReposReturnValue => {
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(true);
  const [error, setError] = useState<string>();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    if (!installationId) {
      setLoading(false);
      return;
    }

    setHasNextPage(false);

    if (page > 1) {
      setIsLoadingMore(true);
    } else {
      setLoading(true);
    }

    githubApi
      .repositories({
        installationId,
        params: {
          page,
          per_page: defaultPageQueryParams.per_page,
        },
      })
      .then(res => {
        setHasNextPage(
          res.total_count > page * defaultPageQueryParams.per_page!
        );

        let repoList: Repo[] = [];

        if (page > 1) {
          repoList = repos;
        }

        setRepos([
          ...repoList,
          ...res.repositories.map(r => ({
            name: r.name,
            fullName: r.full_name,
          })),
        ]);
      })
      .catch(() => {
        setError(errorMessage);
      })
      .finally(() => {
        setLoading(false);
        setIsLoadingMore(false);
      });
  }, [page, installationId]);

  return { repos, hasNextPage, loading, isLoadingMore, error };
};

interface FetchAccountsReturnValue {
  error?: string;
  loading: boolean;
  accounts: Account[];
}

interface FetchAccountProps {
  refreshToken?: number;
}

export const useFetchAccounts = ({
  refreshToken,
}: FetchAccountProps): FetchAccountsReturnValue => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    setLoading(true);

    githubApi
      .installations()
      .then(inst => {
        if (inst.total_count > 0) {
          setAccounts(getAccounts(inst.installations));
        }
      })
      .catch(e => {
        console.log(e);
        setError(errorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refreshToken]);

  return { error, loading, accounts };
};
