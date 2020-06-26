import nock from "nock";

export const appProxy = ({ app, status = 200, envs = [] }) => {
  envs.forEach((env) => {
    const domain = env.domain?.verified
      ? env.domain.name
      : `${app.displayName}--${env.env}.stormkit.dev`;

    nock("http://localhost")
      .post(`/app/proxy`, { appId: app.id, url: `https://${domain}` })
      .reply(200, { status });
  });
};
