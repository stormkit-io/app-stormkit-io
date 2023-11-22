interface AppProps {
  id?: string;
  repo?: string;
  displayName?: string;
}

const defaultProps = {
  id: "1",
  repo: "gitlab/stormkit-io/frontend",
  displayName: "app",
};

export default ({ repo, displayName, id }: AppProps = {}): App => ({
  id: id || defaultProps.id,
  repo: repo || defaultProps.repo,
  teamId: "231",
  displayName: displayName || defaultProps.displayName,
  createdAt: 1551184215,
  defaultEnv: "production",
  deployedAt: 1588622630,
  status: true,
  userId: "1",
  autoDeploy: "pull_request",
  endpoint: "app.stormkit.dev",
  provider: "gitlab",
});
