import React from "react";
import { History } from "history";
import qs from "query-string";
import api from "~/utils/api/Api";
import bitbucketApi from "~/utils/api/Bitbucket";
import Spinner from "~/components/Spinner";
import { BitbucketButton } from "~/components/Buttons";
import { login as loginUser } from "./actions";
import LoginScreen from "./_components/LoginScreen";
import RepoList from "./_components/RepoList";
import Accounts from "./_components/Accounts";

interface Account {
  selected?: boolean;
  login: string;
  avatar: string;
  type: "user" | "team";
}

interface Repository {
  name: string;
}

interface PageQueryParams {}

interface Props {
  history: History;
  loginOauth: () => void;
  filter?: string;
}

interface State {
  accounts?: Account[];
  selectedAccount?: Account;
  repositories?: Repository[];
  loadingInsert?: boolean;
  loading?: boolean;
  requiresLogin?: boolean;
  hasNextPage?: boolean;
  pageQueryParams?: PageQueryParams;
}

export default class BitbucketRepositories extends React.PureComponent<
  Props,
  State
> {
  state: State = {
    loadingInsert: false,
    accounts: [],
    repositories: [],
    loading: true,
    hasNextPage: false,
    pageQueryParams: {},
  };

  unmounted = false;

  componentDidMount() {
    this.init();
  }

  init = async () => {
    if (!bitbucketApi.accessToken) {
      return await this.updateState({ requiresLogin: true });
    }

    try {
      await this.user();
      const selectedAccount = this.state.accounts?.find(a => a.selected);
      await this.updateState({ selectedAccount });
      await this.getRepositories();
    } catch (res) {
      if (res instanceof Error && res.message === "unauthorized") {
        this.updateState({ requiresLogin: true });
      } else {
        console.log("Something unexpected occurred:", res);
      }
    }
  };

  user = async () => {
    const bbUser = await bitbucketApi.user();

    // Normalize the user and make it look like an account.
    const user: Account = {
      login: bbUser.nickname || bbUser.username,
      avatar: bbUser.links.avatar.href,
      type: "user",
      selected: true,
    };

    await this.updateState({ accounts: [user] });
    return user;
  };

  getRepositories = async () => {
    // set loading to true to show a spinner until api requests are done
    this.updateState({ loading: true });

    // get the selected account
    const { selectedAccount } = this.state;

    if (!selectedAccount) {
      return this.updateState({ loading: false });
    }

    // get current pageIndex and items per page
    const { repositories, pageQueryParams } = this.state;

    // api params
    const defaultParams = {
      role: "admin",
      pagelen: 100,
    };

    // fetch the repositories
    const res = await bitbucketApi.repositories({
      params: { ...defaultParams, ...pageQueryParams },
    });

    // check if there is a next page with more repositories
    const hasNextPage = !!res.next;

    // gather the params for the next page (if there is one) into an object for consecutive calls through `load more` button
    const nextPageParams = hasNextPage
      ? qs.parse(res.next.split("?")[1])
      : defaultParams;

    this.updateState({
      repositories: [...repositories!, ...res.values],
      loading: false,
      hasNextPage,
      pageQueryParams: nextPageParams,
    });
  };

  onAccountChange = async (login: string) => {
    const selectedAccount = this.state.accounts?.find(a => a.login === login);
    const accounts = [...this.state.accounts!].map(a => ({
      ...a,
      selected: a.login === login,
    }));

    if (selectedAccount) {
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
    const { loginOauth, history, filter } = this.props;
    const {
      accounts = [],
      loading,
      requiresLogin,
      repositories,
      hasNextPage,
    } = this.state;
    const { login } = accounts.filter(i => i.selected)[0] || {};

    if (requiresLogin) {
      return (
        <LoginScreen>
          <BitbucketButton
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
            history={history}
            repositories={repositories?.filter(r =>
              r.name.includes(filter || "")
            )}
            provider="bitbucket"
            loading={loading}
            onNextPageClick={this.getRepositories}
            hasNextPage={hasNextPage}
          />
        </div>
      </>
    );
  }
}
