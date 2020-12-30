import React, { ReactElement, useEffect, FC } from "react";
import AuthContext from "~/pages/auth/Auth.context";
import { connect } from "~/utils/context";

type Props = {
  logout: () => void;
}

const Logout: FC<Props> = ({ logout }: Props): ReactElement => {
  useEffect(() => {
    logout();
  }, [logout]);

  return <></>;
};

export default connect(Logout, [{ Context: AuthContext, props: ["logout"] }]);
