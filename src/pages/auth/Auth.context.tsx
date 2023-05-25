import React, { createContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

interface Props {
  children: React.ReactNode;
}

export default function ContextProvider({ children }: Props) {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { error, loading, user, accounts, ...fns } = useFetchUser();
  const shouldRedirect = !loading && !user && !pathname.includes("/auth");

  useEffect(() => {
    if (shouldRedirect) {
      const encoded =
        pathname !== "/" && pathname !== "/logout"
          ? encodeURIComponent(`${pathname}${search}`)
          : undefined;

      navigate(`/auth${encoded ? `?redirect=${encoded}` : ""}`);
    }
  }, [shouldRedirect]);

  useEffect(() => {
    if (user?.isPaymentRequired) {
      navigate("/user/account?expired=true");
    }
  }, [user?.isPaymentRequired, pathname]);

  if (loading) {
    return <Spinner primary pageCenter />;
  }

  // Redirect the user to the console login if he/she
  // is not logged in and the pathname is not auth.
  if (shouldRedirect) {
    return null;
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
}
