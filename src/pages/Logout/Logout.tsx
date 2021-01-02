import { useEffect, FC } from "react";
import AuthContext from "~/pages/auth/Auth.context";
import { connect } from "~/utils/context";

type Props = {
  logout: () => void;
}

const Logout: FC<Props> = ({ logout }: Props): null => {
  useEffect(() => {
    logout();
  }, [logout]);

  return null;
};

export default connect(Logout, [{ Context: AuthContext, props: ["logout"] }]);
