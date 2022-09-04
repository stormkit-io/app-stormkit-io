import React from "react";
import api from "~/utils/api/Api";
import githubApi from "~/utils/api/Github";
import Spinner from "~/components/Spinner";
import Link from "~/components/Link";
import { GithubButton } from "~/components/Buttons";
import openPopup from "~/utils/helpers/popup";
import { login as loginUser } from "./actions";
import LoginScreen from "./_components/LoginScreen";
import RepoList from "./_components/RepoList";
import Accounts from "./_components/Accounts";

const URL = {
  production: "https://github.com/apps/stormkit-io/installations/new",
  staging: "https://github.com/apps/stormkit-io-staging/installations/new",
  test: "https://github.com/apps/stormkit-io-dev/installations/new",
  local: "https://github.com/apps/stormkit-io-dev/installations/new",
}[process.env.STORMKIT_ENV as "production" | "staging" | "test" | "local"];

const defaultPageQueryParams = {
  page: 1,
  per_page: 25,
};

interface Repository {
  name: string;
}

interface Account {
  login: string;
  installationId: string;
  avatar: string;
}

interface Props {
  user: User;
  filter?: string;
  loginOauth: () => void;
}

interface State {
  accounts?: Account[];
  repositories?: Repository[];
  selectedAccount?: Account;
  loading?: boolean;
  requiresLogin?: boolean;
  loadingInsert?: boolean;
  hasNextPage?: boolean;
  pageQueryParams?: {
    page: number;
    per_page: number;
  };
}

export default class GithubRepos extends React.PureComponent<Props, State> {
  state: State = {
    accounts: [],
    repositories: [],
    loading: true,
    requiresLogin: false,
    loadingInsert: false,
    hasNextPage: false,
    pageQueryParams: defaultPageQueryParams,
  };

  unmounted = false;

  async componentDidMount() {
    this.init();
  }

  init = async () => {
    try {
      if (!githubApi.accessToken) {
        return this.updateState({ requiresLogin: true });
      }

      const { accounts, selectedAccount } = await this.getInstallations();
      await this.updateState({ accounts, selectedAccount });
      this.getRepositories();
    } catch (e) {
      if (e instanceof Error && e.message === "unauthorized") {
        this.updateState({ requiresLogin: true });
      } else {
        this.updateState({ loading: false });
      }
    }
  };

  getInstallations = async (): Promise<{
    accounts?: Account[];
    selectedAccount?: Account;
  }> => {
    const insts = await githubApi.installations();

    if (insts.total_count === 0) {
      this.updateState({ repositories: [], loading: false });
      return {};
    }

    const accounts: Account[] = [];
    const { user } = this.props;
    let selectedAccount;

    // List installations. From these installations we will be able to fetch the accounts.
    insts.installations.forEach((inst: any) => {
      const acc = {
        login: inst.account.login,
        installationId: inst.id,
        avatar: inst.account.avatar_url,
      };

      if (inst?.account?.login === user.displayName) {
        selectedAccount = acc;
      }

      accounts.push(acc);
    });

    // If there is no match between current user display name and
    // the accounts, then select the first one.
    // Why we have this?
    // If you're invited as a member to other repos, and they are also
    // using stormkit, github might return other accounts first. So instead
    // of seeing repos from your individual account first, you see other people's repositories.
    // To prevent this, above we check that displayName === account.login. If nothing matches we
    // select the first one.
    if (!selectedAccount && accounts[0]) {
      selectedAccount = accounts[0];
    }

    return { accounts, selectedAccount };
  };

  connectRepo = (e: React.MouseEvent) => {
    e.preventDefault();

    openPopup({
      url: URL,
      title: "Add repository",
      width: 1000,
      onClose: async () => {
        const { accounts, selectedAccount } = await this.getInstallations();
        this.updateState({ accounts, selectedAccount });
        this.getRepositories();
      },
    });
  };

  getRepositories = async () => {
    // get the selected account
    const { selectedAccount } = this.state;

    if (!selectedAccount) {
      return;
    }

    const { repositories, pageQueryParams } = this.state;

    this.updateState({ loading: true });

    const res = await githubApi.repositories({
      installationId: selectedAccount.installationId,
      params: pageQueryParams,
    });

    const hasNextPage =
      res.total_count > pageQueryParams!.page * pageQueryParams!.per_page;

    this.updateState({
      repositories: [...repositories!, ...res.repositories],
      loading: false,
      hasNextPage,
      pageQueryParams: hasNextPage
        ? {
            per_page:
              pageQueryParams?.per_page || defaultPageQueryParams.per_page,
            page: pageQueryParams!.page + 1,
          }
        : pageQueryParams,
    });
  };

  onAccountChange = async (login: string) => {
    const selectedAccount = this.state.accounts?.find(a => a.login === login);
    const accounts = [...this.state.accounts!].map(a => ({
      ...a,
      selected: a.login === login,
    }));

    if (selectedAccount) {
      this.updateState({ pageQueryParams: defaultPageQueryParams });
      await this.updateState({ repositories: [], accounts, selectedAccount });
      this.getRepositories();
    }
  };

  updateState = (args: State) => {
    // wait for the callback to be triggered to resolve the promise to avoid side effects (too) slowly mutating the state
    return new Promise(resolve => {
      if (this.unmounted !== true) {
        this.setState(args, () => {
          resolve(true);
        });
      } else {
        resolve(true);
      }
    });
  };

  componentWillUnmount() {
    this.unmounted = true;
  }

  render() {
    const { loginOauth, filter } = this.props;
    const {
      repositories,
      accounts = [],
      selectedAccount,
      loading,
      requiresLogin,
      hasNextPage,
    } = this.state;

    const { login } = selectedAccount || {};

    if (requiresLogin) {
      return (
        <LoginScreen>
          <GithubButton
            onClick={loginUser({
              loginOauth,
              updateState: (args: State) => this.updateState(args),
              init: () => this.init(),
            })}
          />
        </LoginScreen>
      );
    }

    if (loading && accounts.length === 0) {
      return (
        <div className="mt-12 flex w-full justify-center">
          <Spinner primary />
        </div>
      );
    }

    return (
      <>
        <div className="mt-4 mb-4 w-full">
          {accounts.length > 0 && (
            <Accounts
              selected={login}
              onAccountChange={this.onAccountChange}
              accounts={accounts}
            />
          )}
        </div>

        <div className="flex-auto">
          <RepoList
            api={api}
            repositories={repositories?.filter(r => r.name.includes(filter!))}
            provider="github"
            loading={loading}
            onNextPageClick={this.getRepositories}
            hasNextPage={hasNextPage}
          />
        </div>

        <div className="w-full text-center mt-12">
          Can't see what you're looking for?{" "}
          <Link to={URL} onClick={this.connectRepo} secondary>
            {repositories?.length
              ? "Connect more repositories"
              : "Connect repositories"}
          </Link>
          .
        </div>
      </>
    );
  }
}
