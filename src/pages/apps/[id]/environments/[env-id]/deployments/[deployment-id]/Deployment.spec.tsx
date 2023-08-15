import type { Scope } from "nock";
import { render, RenderResult, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import mockApp from "~/testing/data/mock_app";
import mockDeployment from "~/testing/data/mock_deployment";
import mockEnvironment from "~/testing//data/mock_environment";
import { mockFetchDeploymentCall } from "~/testing/nocks/nock_deployments";
import Deployment from "./Deployment";

interface Props {
  app?: App;
  deployment?: Deployment;
  environment?: Environment;
}

jest.mock("~/utils/helpers/deployments", () => ({
  formattedDate: () => "21.09.2022 - 21:30",
}));

describe("~/apps/[id]/environments/[env-id]/deployments/Deployment.tsx", () => {
  let wrapper: RenderResult;
  let currentApp: App;
  let currentEnv: Environment;
  let currentDeploy: Deployment;
  let scope: Scope;
  let id = 1050101;

  const createWrapper = ({
    app,
    environment,
    deployment,
  }: Props | undefined = {}) => {
    currentApp = app || mockApp();
    currentEnv = environment || mockEnvironment({ app: currentApp });
    currentDeploy =
      deployment ||
      mockDeployment({
        appId: currentApp.id,
        envId: currentEnv.id,
        id: id++ + "",
      });

    scope = mockFetchDeploymentCall({
      deploy: currentDeploy,
      response: { deploy: currentDeploy },
    });

    const memoryRouter = createMemoryRouter(
      [
        {
          path: "/apps/:appId/environments/:envId/deployments/:deploymentId",
          element: (
            <AppContext.Provider
              value={{
                app: currentApp,
                environments: [currentEnv],
                setRefreshToken: jest.fn(),
              }}
            >
              <EnvironmentContext.Provider value={{ environment: currentEnv }}>
                <Deployment />
              </EnvironmentContext.Provider>
            </AppContext.Provider>
          ),
        },
      ],
      {
        initialIndex: 0,
        initialEntries: [
          `/apps/${currentApp.id}/environments/${currentEnv.id}/deployments/${currentDeploy.id}`,
        ],
      }
    );

    wrapper = render(<RouterProvider router={memoryRouter} />);
  };

  test("should display deployment details", async () => {
    createWrapper();

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(wrapper.getByText("chore: bump version")).toBeTruthy();
      expect(wrapper.getByText("21.09.2022 - 21:30")).toBeTruthy();
      expect(wrapper.getByText("main")).toBeTruthy();
    });
  });

  test("should display the logs", async () => {
    createWrapper();

    await waitFor(() => {
      expect(wrapper.getByText("Nuxt CLI v3.0.0-rc.8")).toBeTruthy();
    });
  });

  test("should display the preview button for successful deployments", async () => {
    createWrapper();

    await waitFor(() => {
      expect(wrapper.getByText("Preview")).toBeTruthy();
    });
  });

  test("should display expand menu", async () => {
    createWrapper();

    await waitFor(() => {
      expect(wrapper.getByLabelText("expand")).toBeTruthy();
    });
  });
});
