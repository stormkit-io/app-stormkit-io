import React from "react";
import PropTypes from "prop-types";
import Spinner from "~/components/Spinner";
import AppContext from "~/pages/Apps/Apps.context";
import { connect } from "~/utils/context";
import AppMenu from "./_components/AppMenu";
import AppHeader from "./_components/AppHeader";

const AppLayout = ({ children, loading, app, error }) => {
  if (loading) {
    return <Spinner pageCenter secondary />;
  }

  return (
    <main className="flex min-h-screen m-auto items-center">
      <div className="w-64 fixed left-0 top-0 bottom-0">
        <AppMenu app={app} />
      </div>
      <div className="flex flex-col flex-auto w-full ml-64 px-4 min-h-screen">
        <div className="flex flex-grow-0 max-w-screen-lg m-auto w-full mb-24">
          <AppHeader app={app} />
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
  loading: PropTypes.bool,
  error: PropTypes.any,
};

export default connect(AppLayout, [
  { Context: AppContext, props: ["app", "error", "loading"] },
]);
