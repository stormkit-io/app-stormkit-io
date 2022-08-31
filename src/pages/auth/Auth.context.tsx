import React, { createContext } from "react";
import { Redirect, useLocation } from "react-router-dom";
import Spinner from "~/components/Spinner";
import {
  loginOauth,
  useFetchUser,
  LoginOauthReturnValue,
  logout,
} from "./actions";

export interface AuthContextProps {
  user?: User;
  authError?: string | null;
  accounts?: Array<ConnectedAccount>;
  logout?: () => void;
  loginOauth?: (p: Provider) => Promise<LoginOauthReturnValue>;
}

export const AuthContext = createContext<AuthContextProps>({});

const ContextProvider: React.FC = ({ children }): React.ReactElement => {
  const { pathname, search } = useLocation();
  const { error, loading, user, accounts, ...fns } = useFetchUser();

  if (loading) {
    return <Spinner primary pageCenter />;
  }

  // Redirect the user to the console login if he/she
  // is not logged in and the pathname is not auth.
  if (!user && pathname.indexOf("/auth") === -1) {
    const encoded =
      pathname !== "/" && pathname !== "/logout"
        ? encodeURIComponent(`${pathname}${search}`)
        : undefined;

    return <Redirect to={`/auth${encoded ? `?redirect=${encoded}` : ""}`} />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accounts,
        authError: error,
        logout: logout(), // This function can be removed, it's no longer being injected something.
        loginOauth: loginOauth({ ...fns }),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default ContextProvider;
