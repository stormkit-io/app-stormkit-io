import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import api from "~/utils/api/Api";
import { useFetchMailerConfig } from "../actions";

interface Props {
  app: App;
  environment: Environment;
}

export default function TabMailer({ app, environment: env }: Props) {
  const [refreshToken, setRefreshToken] = useState<number>();
  const [formError, setFormError] = useState<string>();
  const [sendLoading, setSendLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>();
  const { loading, error, config } = useFetchMailerConfig({
    appId: app.id,
    envId: env.id!,
    refreshToken,
  });

  const handleUpdateConfig: React.FormEventHandler = e => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<
      string,
      string
    >;

    if (data["username"] === "") {
      return setFormError("Username is a required field");
    }

    api
      .post("/mailer/config", { appId: app.id, envId: env.id!, ...data })
      .then(() => {
        setSuccess("Mailer configuration saved successfully.");
        setRefreshToken(Date.now());
      });
  };

  return (
    <Card
      id="mailer"
      component="form"
      loading={loading}
      error={error || formError}
      success={success}
      onSubmit={handleUpdateConfig}
      sx={{ "div[data-lastpass-icon-root]": { display: "none" } }}
    >
      <CardHeader
        title="Mailer Configuration"
        subtitle="Simple Email Service to send transactional emails."
      />

      <Box sx={{ mb: 4 }}>
        <TextField
          label="SMTP Host"
          name="smtpHost"
          fullWidth
          defaultValue={config?.host || ""}
          variant="filled"
          autoComplete="off"
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <TextField
          label="SMTP Port"
          name="smtpPort"
          fullWidth
          defaultValue={config?.port || ""}
          variant="filled"
          autoComplete="off"
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <TextField
          label="Username"
          name="username"
          fullWidth
          defaultValue={config?.username || ""}
          variant="filled"
          autoComplete="off"
        />
      </Box>

      <Box sx={{ mb: 4 }}>
        <TextField
          type="password"
          label="Password"
          name="password"
          fullWidth
          defaultValue={config?.password || ""}
          variant="filled"
          autoComplete="off"
        />
      </Box>

      <CardFooter>
        {config && (
          <Button
            type="button"
            variant="text"
            color="info"
            loading={sendLoading}
            sx={{ mr: 2 }}
            onClick={() => {
              setSendLoading(true);

              api
                .post("/mailer", {
                  // fetch treats the `body` argument as a json string so we
                  // need to stringify the parameters to make this api call work.
                  body: JSON.stringify({
                    appId: app.id,
                    envId: env.id!,
                    from: config.username,
                    to: config.username,
                    body: "Test email body",
                    subject: "Test email subject",
                  }),
                })
                .then(() => {
                  setSuccess("Test email sent to " + config.username);
                })
                .catch(() => {
                  setFormError(
                    "Something went wrong while sending test email."
                  );
                })
                .finally(() => {
                  setSendLoading(false);
                });
            }}
          >
            Send test email
          </Button>
        )}

        <Button type="submit" variant="contained" color="secondary">
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
