import React from "react";
import PropTypes from "prop-types";

const DefaultLayout = ({ children }) => {
  return (
    <main className="flex flex-col max-w-screen-xl min-h-screen m-auto items-center justify-center">
      {children}
    </main>
  );
};

DefaultLayout.propTypes = {
  children: PropTypes.node,
  header: PropTypes.node,
};

export default DefaultLayout;
