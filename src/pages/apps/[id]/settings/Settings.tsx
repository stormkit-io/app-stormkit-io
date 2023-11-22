import React, { useContext, useEffect } from "react";
import Box from "@mui/material/Box";
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
  const { app, environments } = useContext(AppContext);
  const { user } = useContext(AuthContext);
  const isCurrentUserTheOwner = app.userId === user!.id;
  const { settings, loading, setSettings } = useFetchAdditionalSettings({
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

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          m: "auto",
        }}
        maxWidth="md"
      >
        <Spinner secondary />
      </Box>
    );
  }

  return (
    <Box sx={{ color: "white", m: "auto" }} maxWidth="md">
      <FormAppSettings app={app} additionalSettings={settings} />

      <FormTriggerDeploys
        app={app}
        additionalSettings={settings}
        setAdditionalSettings={setSettings}
        environments={environments}
      />

      <FormOutboundWebhooks app={app} />

      {isCurrentUserTheOwner && (
        <Container title="Danger zone" maxWidth="max-w-none" className="mb-4">
          <FormDangerZone app={app} />
        </Container>
      )}
    </Box>
  );
};

export default Settings;
