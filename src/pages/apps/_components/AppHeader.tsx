import React from "react";
import UserMenu from "~/layouts/_components/UserMenu";
import Link from "~/components/Link";
import { formattedDate } from "~/utils/helpers/deployments";
import { RootContextProps } from "~/pages/Root.context";
import AppHeaderActions from "./AppHeaderActions";

interface Props extends Pick<RootContextProps, "api"> {
  app: App;
  envs: Array<Environment>;
}

const providerHosts: Record<Provider, string> = {
  bitbucket: "bitbucket.org",
  github: "github.com",
  gitlab: "gitlab.com",
};

const AppHeader: React.FC<Props> = ({ app, envs, api }): React.ReactElement => {
  const repoPath = app.repo.substring(app.repo.indexOf("/") + 1);

  return (
    <header className="flex w-full mt-6">
      <div className="flex items-center pt-1">
        <span className={`fab fa-${app.provider} text-white mr-6 text-5xl`} />
        <div className="flex flex-col">
          <div className="text-white mb-1">
            <Link
              to={`https://${providerHosts[app.provider]}/${repoPath}`}
              aria-label="Repository URL"
            >
              {app.repo}
            </Link>
          </div>
          <div className="text-secondary text-sm">
            Last deploy: {formattedDate(app.deployedAt)}
            <span
              className={`inline-block ml-2 w-2 h-2 rounded-full bg-${
                app.status ? "green-50" : "red-50"
              }`}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-auto items-center justify-end">
        <AppHeaderActions app={app} api={api} environments={envs} />
        <UserMenu />
      </div>
    </header>
  );
};

export default AppHeader;
