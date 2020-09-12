import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Spinner from "~/components/Spinner";
import { BitbucketButton } from "~/components/Buttons";
import { login as loginUser } from "./actions";
import LoginScreen from "./_components/LoginScreen";
import RepoList from "./_components/RepoList";
import Accounts from "./_components/Accounts";

export default class BitbucketRepositories extends PureComponent {
  static propTypes = {
    bitbucket: PropTypes.object, // The bitbucket api
    history: PropTypes.object,
    api: PropTypes.object,
    loginOauth: PropTypes.func,
  };

  state = {
    selectedAccount: null,
    loadingInsert: false,
    accounts: [],
    repositories: [],
    loading: true,
    errors: {},
    itemsPerPage: 100,
    hasNextPage: false,
    pageQueryParams: [],
  };

  componentDidMount() {
    this.init();
  }

  init = async () => {
    if (!this.props.bitbucket.accessToken) {
      return this.updateState({ requiresLogin: true });
    }

    try {
      await this.user();
      await this.teams();
      await this.getRepositories();
    } catch (res) {
      if (res.message === "unauthorized") {
        this.updateState({ requiresLogin: true });
      } else {
        this.updateState({ error: "Something unexpected occurred." });
      }
    }
  };

  user = async () => {
    const api = this.props.bitbucket;
    const bbUser = await api.user();

    // Normalize the user and make it look like an account.
    const user = {
      login: bbUser.nickname || bbUser.username,
      avatar: bbUser.links.avatar.href,
      type: "user",
      selected: true,
    };

    this.updateState({ accounts: [user] });
    return user;
  };

  teams = async () => {
    const api = this.props.bitbucket;
    const teams = await api.teams();

    if (teams.size === 0) {
      return this.updateState({ loading: false });
    }

    const accounts = this.state.accounts.concat(
      teams.values.map((t) => ({
        login: t.username,
        avatar: t.links.avatar.href,
        type: "team",
        selected: false,
      }))
    );

    return new Promise((resolve) => {
      this.updateState({ accounts }, () => resolve(accounts));
    });
  };

  getRepositories = async () => {
    // set loading to true to show a spinner until api requests are done
    this.updateState({ loading: true });

    // get the selected account
    const account = this.state.accounts.filter((a) => a.selected)[0];

    if (!account) {
      return this.updateState({ loading: false });
    }

    const api = this.props.bitbucket;

    // get current pageIndex and items per page
    const { itemsPerPage, repositories, pageQueryParams } = this.state;

    // If the account type is a team, we include it in the repo call
    // to filter the results.
    const res = await api.repositories({
      team: account.type === "team" ? account.login : undefined,
      perPage: itemsPerPage,
      params: pageQueryParams,
    });

    // adds the current page to the repositories
    const page = res.values;
    repositories.push(...page);

    // check if there is a next page with more repositories
    const hasNextPage = !!res.next;

    // gather the params for the next page (if there is one) into an array for consecutive calls through `load more` button
    const nextPageParams = hasNextPage
      ? res.next
          .split("?")[1]
          .split("&")
          .map((p) => ({ name: p.split("=")[0], value: p.split("=")[1] }))
      : [];

    this.updateState({
      selectedAccount: account,
      repositories: repositories,
      loading: false,
      hasNextPage,
      pageQueryParams: nextPageParams,
    });
  };

  onAccountChange = (login) => {
    const accounts = this.state.accounts.map((a) => ({
      ...a,
      selected: a.login === login,
    }));

    this.updateState(
      { accounts, loading: true, repositories: [] },
      this.repositories
    );
  };

  updateState = (...args) => {
    if (this.unmounted !== true) {
      this.setState(...args);
    }
  };

  componentWillUnmount() {
    this.unmounted = true;
  }

  render() {
    const { loginOauth, history, api } = this.props;
    const {
      accounts = [],
      loading,
      requiresLogin,
      repositories,
      hasNextPage,
    } = this.state;
    const { login } = accounts.filter((i) => i.selected)[0] || {};

    if (requiresLogin) {
      return (
        <LoginScreen>
          <BitbucketButton
            onClick={loginUser({
              loginOauth,
              updateState: (...args) => this.updateState(...args),
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
        <div className="mt-12 mb-4 w-full">
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
            repositories={repositories}
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
