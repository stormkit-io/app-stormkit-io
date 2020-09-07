import React from "react";
import PropTypes from "prop-types";
import AppMenu from "./_components/AppMenu";
import AppHeader from "./_components/AppHeader";

const AppLayout = ({ children, app, error, actions }) => {
  if (error) {
    return <div>{error.message || error}</div>;
  }

  if (!app) {
    return children;
  }

  return (
    <main className="flex min-h-screen m-auto items-center app-layout">
      <div className="w-64 fixed left-0 top-0 bottom-0">
        <AppMenu app={app} />
      </div>
      <div className="flex flex-col flex-auto w-full ml-64 px-4 min-h-screen">
        <div className="flex flex-grow-0 max-w-screen-lg m-auto w-full mb-24">
          <AppHeader app={app} actions={actions} />
        </div>
        <div className="flex flex-auto max-w-screen-lg m-auto w-full">
          {children}
        </div>
      </div>
    </main>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node,
  app: PropTypes.object,
  actions: PropTypes.node, // The header actions that will be displayed on top right.
};

export default AppLayout;
