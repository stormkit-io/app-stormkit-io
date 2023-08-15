import type { Scope } from "nock";
import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import mockApp from "~/testing/data/mock_app";
import mockDeployment from "~/testing/data/mock_deployment";
import mockEnvironment from "~/testing//data/mock_environment";
import {
  mockFetchDeploymentsCall,
  mockDeleteDeploymentCall,
} from "~/testing/nocks/nock_deployments";
import Deployments from "./Deployments";

interface Props {
  app?: App;
  environment?: Environment;
  deployments?: Deployment[];
}

jest.mock("~/utils/helpers/date", () => ({
  timeSince: () => "2 hours",
}));

describe("~/apps/[id]/environments/[env-id]/deployments/Deployments.tsx", () => {
  let wrapper: RenderResult;
  let currentApp: App;
  let currentEnv: Environment;
  let currentDeploys: Deployment[];
  let scope: Scope;
  let id = 1050101;

  const createWrapper = ({
    app,
    environment,
    deployments,
  }: Props | undefined = {}) => {
    currentApp = app || mockApp();
    currentEnv = environment || mockEnvironment({ app: currentApp });
    currentDeploys = deployments || [
      mockDeployment({
        appId: currentApp.id,
        envId: currentEnv.id,
        id: id++ + "",
      }),
    ];

    scope = mockFetchDeploymentsCall({
      appId: currentApp.id,
      from: 0,
      filters: { envId: currentEnv.id! },
      response: { hasNextPage: false, deploys: currentDeploys },
    });

    const memoryRouter = createMemoryRouter([
      {
        path: "*",
        element: (
          <AppContext.Provider
            value={{
              app: currentApp,
              environments: [currentEnv],
              setRefreshToken: jest.fn(),
            }}
          >
            <EnvironmentContext.Provider value={{ environment: currentEnv }}>
              <Deployments />
            </EnvironmentContext.Provider>
          </AppContext.Provider>
        ),
      },
    ]);

    wrapper = render(<RouterProvider router={memoryRouter} />);
  };

  test("should list deployments", async () => {
    createWrapper();

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(wrapper.getByText("chore: bump version")).toBeTruthy();
      expect(wrapper.getByText("2 hours ago")).toBeTruthy();
      expect(wrapper.getByText("main")).toBeTruthy();
    });
  });

  test("should handle deleting deployment", async () => {
    createWrapper();

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(wrapper.getByText("chore: bump version")).toBeTruthy();
    });

    const deleteScope = mockDeleteDeploymentCall({
      appId: currentApp.id,
      deploymentId: currentDeploys[0].id,
    });

    fireEvent.click(wrapper.getByLabelText("expand"));

    await waitFor(() => {
      expect(wrapper.getByText("Delete")).toBeTruthy();
    });

    fireEvent.click(wrapper.getByText("Delete"));

    await waitFor(() => {
      expect(wrapper.getByText("Yes, continue")).toBeTruthy();
    });

    fireEvent.click(wrapper.getByText("Yes, continue"));

    await waitFor(() => {
      expect(deleteScope.isDone()).toBe(true);
    });
  });

  test("displays an empty list when there are no deployments", async () => {
    createWrapper({ deployments: [] });

    await waitFor(() => {
      expect(wrapper.getByText("It is quite empty here.")).toBeTruthy();
      expect(wrapper.getByText("Click to deploy")).toBeTruthy();
    });
  });
});
