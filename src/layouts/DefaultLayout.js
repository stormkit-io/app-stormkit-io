import React from "react";
import PropTypes from "prop-types";
import Header from "./_components/Header";

const DefaultLayout = ({ children, header }) => {
  if (typeof header === "undefined") {
    header = <Header />;
  }

  return (
    <main className="flex flex-col max-w-screen-lg min-h-screen m-auto items-center">
      {header}
      <div className="flex flex-auto mt-12 w-full">
        <div className={"flex flex-auto"}>{children}</div>
      </div>
    </main>
  );
};

DefaultLayout.propTypes = {
  children: PropTypes.node,
  header: PropTypes.node
};

export default DefaultLayout;
