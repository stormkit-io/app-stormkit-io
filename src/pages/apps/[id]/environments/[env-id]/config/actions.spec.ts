import { buildFormValues } from "./actions";
import mockApp from "~/testing/data/mock_app";
import mockEnvironments from "~/testing/data/mock_environments";

describe("~/pages/apps/[id]/environments/[env-id]/config/actions.tsx", () => {
  const app = mockApp();
  const env = mockEnvironments({ app })[0];

  describe("buildFormValues", () => {
    test("should match the default state", () => {
      const values = buildFormValues(env, document.createElement("form"));

      expect(values).toEqual({
        name: env.name,
        branch: env.branch,
        autoDeploy: "disabled",
        autoDeployBranches: undefined,
        autoPublish: "on",
        "build.headersFile": env.build.headersFile,
        "build.redirectsFile": env.build.redirectsFile,
        "build.apiFolder": env.build.apiFolder,
        "build.apiPathPrefix": env.build.apiPathPrefix,
        "build.cmd": env.build.cmd,
        "build.distFolder": env.build.distFolder,
        "build.vars": "BABEL_ENV=production\nNODE_ENV=production",
      });
    });

    test("should match the updated form values", () => {
      const form = document.createElement("form");

      const name = document.createElement("input");
      name.type = "text";
      name.name = "name";
      name.value = "my-new-env";

      const autoPublish = document.createElement("input");
      autoPublish.type = "text";
      autoPublish.name = "autoPublish";
      autoPublish.value = "off";

      const autoDeploy = document.createElement("input");
      autoDeploy.type = "text";
      autoDeploy.name = "autoDeploy";
      autoDeploy.value = "custom";

      const autoDeployBranches = document.createElement("input");
      autoDeployBranches.type = "text";
      autoDeployBranches.name = "autoDeployBranches";
      autoDeployBranches.value = "^(?!dependabot).+";

      form.appendChild(name);
      form.appendChild(autoPublish);
      form.appendChild(autoDeploy);
      form.appendChild(autoDeployBranches);

      const values = buildFormValues(env, form);

      expect(values).toEqual({
        name: "my-new-env",
        branch: env.branch,
        autoDeploy: "custom",
        autoDeployBranches: "^(?!dependabot).+",
        autoPublish: "off",
        "build.headersFile": env.build.headersFile,
        "build.redirectsFile": env.build.redirectsFile,
        "build.apiFolder": env.build.apiFolder,
        "build.apiPathPrefix": env.build.apiPathPrefix,
        "build.cmd": env.build.cmd,
        "build.distFolder": env.build.distFolder,
        "build.vars": "BABEL_ENV=production\nNODE_ENV=production",
      });
    });
  });
});
