import { RenderResult, waitFor } from "@testing-library/react";
import type { Scope } from "nock/types";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import mockApp from "~/testing/data/mock_app";
import mockEnvironment from "~/testing/data/mock_environment";
import { mockFetchStatus } from "~/testing/nocks/nock_environment";
import EnvironmentStatus from "./EnvironmentStatus";

interface Props {
  app: App;
  env: Environment;
}

describe("~/pages/apps/[id]/environments/_components/EnvironmentStatus.tsx", () => {
  let wrapper: RenderResult;
  let fetchStatusScope: Scope;
  let currentApp: App;
  let currentEnv: Environment;

  const createWrapper = ({ app, env }: Props) => {
    fetchStatusScope = mockFetchStatus({
      appId: app.id,
      url: env.domain.name ? `https://${env.domain.name}` : env.preview,
    });

    wrapper = render(
      <MemoryRouter
        initialEntries={[{ pathname: `/apps/${app.id}/environments` }]}
        initialIndex={0}
      >
        <EnvironmentStatus app={app} env={env} />
      </MemoryRouter>
    );
  };

  describe("already published", () => {
    beforeEach(() => {
      currentApp = mockApp();
      currentEnv = mockEnvironment({ app: currentApp });
      currentEnv.lastDeploy = { id: "481481", createdAt: Date.now(), exit: 0 };
      currentEnv.published = [
        { deploymentId: "481481", percentage: 100, branch: "master" },
      ];

      createWrapper({ app: currentApp, env: currentEnv });
    });

    test("should fetch the status for the environment", async () => {
      await waitFor(() => {
        expect(fetchStatusScope.isDone()).toBe(true);
      });
    });

    test("should display a text on the published version", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("200")).toBeTruthy();
        expect(
          wrapper.getByText(
            currentEnv?.domain?.name?.replace(/https?:\/\//, "")!
          )
        ).toBeTruthy();
      });
    });
  });

  describe("deployed but not published", () => {
    const deploymentId = "481481";

    beforeEach(() => {
      currentApp = mockApp();
      currentEnv = mockEnvironment({ app: currentApp });
      currentEnv.lastDeploy = {
        id: deploymentId,
        createdAt: Date.now(),
        exit: 0,
      };

      createWrapper({ app: currentApp, env: currentEnv });
    });

    test("should not fetch the status for the environment", async () => {
      await waitFor(() => {
        expect(fetchStatusScope.isDone()).toBe(false);
      });
    });

    test("should display a text to publish", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("Deployed successfully.")).toBeTruthy();
        expect(wrapper.getByText("Go to deployment").getAttribute("href")).toBe(
          `/apps/${currentApp.id}/environments/${currentEnv.id}/deployments/${deploymentId}`
        );
      });
    });
  });
});
