import { useEffect } from "react";
import PropTypes from "prop-types";
import AuthContext from "~/pages/Auth/Auth.context";
import { connect } from "~/utils/context";

const Logout = ({ logout }) => {
  useEffect(() => {
    logout();
  }, [logout]);
  return null;
};

Logout.propTypes = {
  logout: PropTypes.func,
};

export default connect(Logout, [{ Context: AuthContext, props: ["logout"] }]);
