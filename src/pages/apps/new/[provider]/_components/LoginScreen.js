import React from "react";
import PropTypes from "prop-types";
import InfoBox from "~/components/InfoBox";

const LoginScreen = ({ children }) => {
  return (
    <div className="mt-12">
      <InfoBox className="mb-12">
        Seems like we lack your access token. Please authenticate using the
        button below in order to continue.
      </InfoBox>
      <div className="w-40 m-auto">{children}</div>
    </div>
  );
};

LoginScreen.propTypes = {
  children: PropTypes.node
};

export default LoginScreen;
