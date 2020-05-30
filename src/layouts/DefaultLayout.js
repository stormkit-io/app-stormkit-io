import React from "react";
import cn from "classnames";
import PropTypes from "prop-types";
import Header from "./_components/Header";

const DefaultLayout = ({ children, header, left, right }) => {
  if (typeof header === "undefined") {
    header = <Header />;
  }

  return (
    <main className="flex flex-col max-w-screen-lg min-h-screen m-auto items-center">
      {header}
      <div className="flex flex-auto mt-12 w-full">
        {left && <div className="flex-auto">{left}</div>}
        <div
          className={cn("flex flex-auto", { "ml-8": !!left, "mr-8": !!right })}
        >
          {children}
        </div>
        {right && <div className="flex-auto">{right}</div>}
      </div>
    </main>
  );
};

DefaultLayout.propTypes = {
  children: PropTypes.node,
  header: PropTypes.node,
};

export default DefaultLayout;
