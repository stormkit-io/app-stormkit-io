import nock from "nock";

const endpoint = process.env.API_DOMAIN || "";

interface MockMailerConfig {
  host: string;
  port: string;
  username: string;
  password: string;
}

interface MockFetchMailerConfigProps {
  appId?: string;
  envId?: string;
  teamId?: string;
  status?: number;
  response?: { config: MockMailerConfig };
}

export const mockFetchMailerConfig = ({
  appId = "",
  envId = "",
  status = 200,
  response,
}: MockFetchMailerConfigProps) => {
  return nock(endpoint)
    .get(`/mailer/config?appId=${appId}&envId=${envId}`)
    .reply(status, response);
};

interface MockSetMailerConfigProps {
  appId?: string;
  envId?: string;
  smtpHost?: string;
  smtpPort?: string;
  username?: string;
  password?: string;
  status?: number;
  response?: { ok: boolean };
}

export const mockSetMailerConfig = ({
  appId,
  envId,
  smtpHost,
  smtpPort,
  username,
  password,
  status = 200,
  response = { ok: true },
}: MockSetMailerConfigProps) => {
  return nock(endpoint)
    .post(`/mailer/config`, {
      appId,
      envId,
      smtpHost,
      smtpPort,
      username,
      password,
    })
    .reply(status, response);
};

interface MockSendTestEmailProps {
  appId: string;
  envId: string;
  from: string;
  to: string;
}

export const mockSendTestEmail = ({
  appId,
  envId,
  from,
  to,
}: MockSendTestEmailProps) => {
  return nock(endpoint)
    .post(
      "/mailer",
      JSON.stringify({
        appId,
        envId,
        from,
        to,
        body: "Test email body",
        subject: "Test email subject",
      })
    )
    .reply(200, { ok: true });
};
