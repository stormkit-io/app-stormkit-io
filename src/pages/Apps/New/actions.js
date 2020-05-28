export const login = ({ api, provider, history, loginOauth }) => {
  if (!api) {
    return console.error(
      "Invalid provider api. Was expecting github, gitlab or bitbucket."
    );
  }

  return async () => {
    const { accessToken } = await loginOauth(provider)();

    if (accessToken) {
      history.push(`/apps/new/${provider}`);
    }
  };
};
