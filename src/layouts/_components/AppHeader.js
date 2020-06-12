import React from "react";
import Button from "~/components/Button";
import { formattedDate } from "~/utils/helpers/deployments";

const AppHeader = ({ app }) => {
  const provider = app.repo.split("/").shift();

  return (
    <header className="flex w-full mt-6">
      <div className="flex items-center pt-1">
        <span className={`fab fa-${provider} text-white mr-6 text-5xl`} />
        <div className="flex flex-col">
          <div className="text-white mb-1">{app.name}</div>
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
        <div id="app-header-actions" />
        <Button primary className="rounded-xl py-3 font-bold">
          <span className="fas fa-rocket mr-4 text-lg" />
          <span className="text-sm">Deploy now</span>
        </Button>
      </div>
    </header>
  );
};

export default AppHeader;
