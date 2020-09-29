import React from "react";
import PropTypes from "prop-types";
import { connect } from "~/utils/context";
import RootContext from "~/pages/Root.context";
import AppsContext from "~/pages/apps/Apps.context";
import AuthContext from "~/pages/auth/Auth.context";
import Spinner from "~/components/Spinner";
import FormAppSettings from "./_components/FormAppSettings";
import FormTriggerDeploys from "./_components/FormTriggerDeploys";
import FormIntegrations from "./_components/FormIntegrations";
import FormDangerZone from "./_components/FormDangerZone";
import * as actions from "./actions";

const { useFetchAdditionalSettings } = actions;

const Settings = ({ api, app, environments, location, history, user }) => {
  const isCurrentUserTheOwner = app.userId === user.id;
  const { settings, loading } = useFetchAdditionalSettings({
    api,
    app,
    location,
  });

  return (
    <div>
      <h1 className="mb-4 text-2xl text-white">App settings</h1>
      {loading ? (
        <Spinner primary />
      ) : (
        <>
          <div className="rounded bg-white p-8 mb-8">
            <FormAppSettings
              api={api}
              app={app}
              additionalSettings={settings}
              environments={environments}
              location={location}
              history={history}
            />
          </div>
          <div className="rounded bg-white p-8 mb-8">
            <FormTriggerDeploys
              api={api}
              app={app}
              additionalSettings={settings}
              environments={environments}
              location={location}
              history={history}
            />
          </div>
          <div className="rounded bg-white p-8 mb-8">
            <FormIntegrations
              api={api}
              app={app}
              additionalSettings={settings}
              location={location}
              history={history}
            />
          </div>
          {isCurrentUserTheOwner && (
            <div className="rounded bg-white p-8 mb-8">
              <FormDangerZone api={api} app={app} history={history} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

Settings.propTypes = {
  app: PropTypes.object,
  api: PropTypes.object,
  confirmModal: PropTypes.func,
  location: PropTypes.object,
  history: PropTypes.object,
  user: PropTypes.object,
};

export default connect(Settings, [
  { Context: RootContext, props: ["api"] },
  { Context: AppsContext, props: ["app", "environments"] },
  { Context: AuthContext, props: ["user"] },
]);
