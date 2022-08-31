import React, { useContext, useEffect } from "react";
import { AppContext } from "~/pages/apps/App.context";
import { AuthContext } from "~/pages/auth/Auth.context";
import Spinner from "~/components/Spinner";
import FormAppSettings from "./_components/FormAppSettings";
import FormTriggerDeploys from "./_components/FormTriggerDeploys";
import FormOutboundWebhooks from "./_components/FormOutboundWebhooks";
import FormDangerZone from "./_components/FormDangerZone";
import * as actions from "./actions";

const { useFetchAdditionalSettings } = actions;

const Settings: React.FC = () => {
  const { app, environments } = useContext(AppContext);
  const { user } = useContext(AuthContext);
  const isCurrentUserTheOwner = app.userId === user!.id;
  const { settings, loading } = useFetchAdditionalSettings({
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
            <FormAppSettings app={app} additionalSettings={settings} />
          </div>
          <div className="rounded bg-white p-8 mb-8">
            <FormTriggerDeploys
              app={app}
              additionalSettings={settings}
              environments={environments}
            />
          </div>
          <div className="rounded bg-white p-8 mb-8">
            <FormOutboundWebhooks app={app} />
          </div>
          {isCurrentUserTheOwner && (
            <div className="rounded bg-white p-8 mb-8">
              <FormDangerZone app={app} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Settings;
