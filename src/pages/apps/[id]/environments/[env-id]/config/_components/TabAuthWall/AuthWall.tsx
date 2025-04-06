import AuthWallConfig from "./AuthWallConfig";
import AuthWallUsers from "./AuthWallUsers";

interface Props {
  app: App;
  environment: Environment;
}

export default function TabAuthWall({ app, environment: env }: Props) {
  return (
    <>
      <AuthWallConfig app={app} environment={env} />
      <AuthWallUsers app={app} environment={env} />
    </>
  );
}
