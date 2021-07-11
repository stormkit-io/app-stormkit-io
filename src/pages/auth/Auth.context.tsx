import React, { useMemo, createContext } from "react";
import { Redirect, useLocation } from "react-router-dom";
import Spinner from "~/components/Spinner";
import Api from "~/utils/api/Api";
import Gitlab from "~/utils/api/Gitlab";
import Github from "~/utils/api/Github";
import Bitbucket from "~/utils/api/Bitbucket";
import {
  loginOauth,
  logout,
  useFetchUser,
  LoginOauthReturnValue,
} from "./actions";

const Context = createContext({});

export interface AuthContextProps {
  error: string | null;
  user: User;
  accounts: Array<ConnectedAccount>;
  loginOauth: (p: Provider) => Promise<LoginOauthReturnValue>;
  logout: () => void;
}

interface Props {
  api: Api;
  gitlab: Gitlab;
  github: Github;
  bitbucket: Bitbucket;
  children: React.ReactNode;
}

interface RedirectProps {
  pathname: string;
  search: string;
}

const RedirectUserToAuth: React.FC<RedirectProps> = ({
  pathname,
  search,
}): React.ReactElement => {
  const encoded =
    pathname !== "/" && pathname !== "/logout"
      ? encodeURIComponent(`${pathname}${search}`)
      : undefined;

  return <Redirect to={`/auth${encoded ? `?redirect=${encoded}` : ""}`} />;
};

const AuthContext: React.FC<Props> = ({
  api,
  children,
  ...providerApi
}): React.ReactElement => {
  const { pathname, search } = useLocation();
  const { error, loading, user, accounts, ...fns } = useFetchUser({ api });

  const context = useMemo(
    () => ({
      user,
      accounts,
      error,
      logout: logout({ api }),
      loginOauth: loginOauth({ api, ...providerApi, ...fns }),
    }),
    [user, accounts, error]
  );

  if (loading) {
    return <Spinner primary pageCenter />;
  }

  // Redirect the user to the console login if he/she
  // is not logged in and the pathname is not auth.
  if (!user && pathname.indexOf("/auth") === -1) {
    return <RedirectUserToAuth pathname={pathname} search={search} />;
  }

  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export default Object.assign(AuthContext, {
  Consumer: Context.Consumer,
  Provider: AuthContext,
});
