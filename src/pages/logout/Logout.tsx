import { useEffect, FC } from "react";
import AuthContext, { AuthContextProps } from "~/pages/auth/Auth.context";
import { connect } from "~/utils/context";

const Logout: FC<AuthContextProps> = ({ logout }): null => {
  useEffect(() => {
    logout();
  }, [logout]);

  return null;
};

export default connect<unknown, AuthContextProps>(Logout, [
  { Context: AuthContext, props: ["logout"] },
]);
