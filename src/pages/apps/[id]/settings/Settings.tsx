import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { AuthContext } from "~/pages/auth/Auth.context";
import Spinner from "~/components/Spinner";
import Container from "~/components/Container";
import FormAppSettings from "./_components/FormAppSettings";
import FormTriggerDeploys from "./_components/FormTriggerDeploys";
import FormOutboundWebhooks from "./_components/FormOutboundWebhooks";
import FormDangerZone from "./_components/FormDangerZone";
import * as actions from "./actions";

const { useFetchAdditionalSettings } = actions;

const Settings: React.FC = () => {
  const { app, environments, setRefreshToken } = useContext(AppContext);
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
    <>
      <Container title="App settings" maxWidth="max-w-none" className="mb-4">
        {loading ? (
          <div className="flex justify-center mb-4">
            <Spinner primary />
          </div>
        ) : (
          <FormAppSettings
            app={app}
            additionalSettings={settings}
            onUpdate={() => {
              setRefreshToken(Date.now());
            }}
          />
        )}
      </Container>
      <Container title="Trigger deploys" maxWidth="max-w-none" className="mb-4">
        <FormTriggerDeploys
          app={app}
          additionalSettings={settings}
          environments={environments}
        />
      </Container>
      <Container
        title="Outbound webhooks"
        maxWidth="max-w-none"
        className="mb-4"
      >
        <FormOutboundWebhooks app={app} />
      </Container>
      {isCurrentUserTheOwner && (
        <Container title="Danger zone" maxWidth="max-w-none" className="mb-4">
          <FormDangerZone app={app} />
        </Container>
      )}
    </>
  );
};

export default Settings;
