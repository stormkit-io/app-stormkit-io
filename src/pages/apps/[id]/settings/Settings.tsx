import React, { useEffect } from "react";
import { connect } from "~/utils/context";
import RootContext, { RootContextProps } from "~/pages/Root.context";
import AppContext, { AppContextProps } from "~/pages/apps/App.context";
import AuthContext, { AuthContextProps } from "~/pages/auth/Auth.context";
import Spinner from "~/components/Spinner";
import FormAppSettings from "./_components/FormAppSettings";
import FormTriggerDeploys from "./_components/FormTriggerDeploys";
import FormOutboundWebhooks from "./_components/FormOutboundWebhooks";
import FormDangerZone from "./_components/FormDangerZone";
import * as actions from "./actions";

const { useFetchAdditionalSettings } = actions;

interface ContextProps
  extends Pick<RootContextProps, "api">,
    Pick<AppContextProps, "app" | "environments">,
    Pick<AuthContextProps, "user"> {}

const Settings: React.FC<ContextProps> = ({ api, app, environments, user }) => {
  const isCurrentUserTheOwner = app.userId === user.id;
  const { settings, loading } = useFetchAdditionalSettings({
    api,
    app,
  });

  useEffect(() => {
    if (window.location.hash) {
      setTimeout(() => {
        document
          .querySelector(window.location.hash)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, []);

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
            />
          </div>
          <div className="rounded bg-white p-8 mb-8">
            <FormTriggerDeploys
              api={api}
              app={app}
              additionalSettings={settings}
              environments={environments}
            />
          </div>
          <div className="rounded bg-white p-8 mb-8">
            <FormOutboundWebhooks api={api} app={app} />
          </div>
          {isCurrentUserTheOwner && (
            <div className="rounded bg-white p-8 mb-8">
              <FormDangerZone api={api} app={app} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default connect<unknown, ContextProps>(Settings, [
  { Context: RootContext, props: ["api"] },
  { Context: AppContext, props: ["app", "environments"] },
  { Context: AuthContext, props: ["user"] },
]);
