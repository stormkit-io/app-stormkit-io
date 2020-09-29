import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import g from "lodash.get";
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
  development: "https://github.com/apps/stormkit-io-dev/installations/new",
  test: "https://github.com/apps/stormkit-io-dev/installations/new"
}[process.env.NODE_ENV];

const defaultPageQueryParams = {
  page: 1,
  per_page: 25
};

export default class GithubRepos extends PureComponent {
  static propTypes = {
    github: PropTypes.object,
    history: PropTypes.object,
    loginOauth: PropTypes.func,
    user: PropTypes.object,
    api: PropTypes.object
  };

  state = {
    selectedAccount: null,
    accounts: [],
    repositories: [],
    loading: true,
    errors: {},
    requiresLogin: false,
    loadingInsert: false,
    hasNextPage: false,
    pageQueryParams: defaultPageQueryParams
  };

  async componentDidMount() {
    this.init();
  }

  init = async () => {
    try {
      const { github } = this.props;

      if (!github.accessToken) {
        return this.updateState({ requiresLogin: true });
      }

      const { accounts, selectedAccount } = await this.getInstallations();
      await this.updateState({ accounts, selectedAccount });
      this.getRepositories();
    } catch (e) {
      if (e.message === "unauthorized") {
        this.updateState({ requiresLogin: true });
      } else {
        this.updateState({ errors: e, loading: false });
      }
    }
  };

  getInstallations = async () => {
    const api = this.props.github;
    const insts = await api.installations();

    if (insts.total_count === 0) {
      this.updateState({ repositories: [], loading: false });
      return {};
    }

    const accounts = [];
    const { user } = this.props;
    let selectedAccount;

    // List installations. From these installations we will be able to fetch the accounts.
    insts.installations.forEach(inst => {
      const acc = {
        login: inst.account.login,
        installationId: inst.id,
        avatar: inst.account.avatar_url
      };

      if (g(inst, "account.login") === user.displayName) {
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

  connectRepo = e => {
    e.preventDefault();

    openPopup({
      url: URL,
      title: "Add repository",
      width: 1000,
      onClose: async () => {
        const { accounts, selectedAccount } = await this.getInstallations();
        this.updateState({ accounts, selectedAccount });
        this.getRepositories();
      }
    });
  };

  getRepositories = async () => {
    // get the selected account
    const { selectedAccount } = this.state;

    if (!selectedAccount) {
      return;
    }

    const api = this.props.github;
    const { repositories, pageQueryParams } = this.state;

    this.updateState({ loading: true });

    const res = await api.repositories({
      installationId: selectedAccount.installationId,
      params: pageQueryParams
    });

    const hasNextPage =
      res.total_count > pageQueryParams.page * pageQueryParams.per_page;

    this.updateState({
      repositories: [...repositories, ...res.repositories],
      loading: false,
      hasNextPage,
      pageQueryParams: hasNextPage
        ? { ...pageQueryParams, page: pageQueryParams.page + 1 }
        : pageQueryParams
    });
  };

  onAccountChange = async login => {
    const selectedAccount = this.state.accounts.find(a => a.login === login);
    const accounts = [...this.state.accounts].map(a => ({
      ...a,
      selected: a.login === login
    }));

    if (selectedAccount) {
      this.updateState({ pageQueryParams: defaultPageQueryParams });
      await this.updateState({ repositories: [], accounts, selectedAccount });
      this.getRepositories();
    }
  };

  updateState = (...args) => {
    // wait for the callback to be triggered to resolve the promise to avoid side effects (too) slowly mutating the state
    return new Promise(resolve => {
      if (this.unmounted !== true) {
        this.setState(...args, () => {
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
    const { loginOauth, api, history } = this.props;
    const {
      repositories,
      accounts = [],
      selectedAccount,
      loading,
      requiresLogin,
      hasNextPage
    } = this.state;

    const { login } = selectedAccount || {};

    if (requiresLogin) {
      return (
        <LoginScreen>
          <GithubButton
            onClick={loginUser({
              loginOauth,
              updateState: (...args) => this.updateState(...args),
              init: () => this.init()
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
            provider="github"
            loading={loading}
            onNextPageClick={this.getRepositories}
            hasNextPage={hasNextPage}
          />
        </div>

        <div className="w-full text-center mt-12">
          Can't see what you're looking for?{" "}
          <Link to={URL} onClick={this.connectRepo} secondary>
            {repositories.length
              ? "Connect more repositories"
              : "Connect repositories"}
          </Link>
          .
        </div>
      </>
    );
  }
}
