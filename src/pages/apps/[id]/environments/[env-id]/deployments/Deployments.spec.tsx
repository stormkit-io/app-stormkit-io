import type { Scope } from "nock";
import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import mockApp from "~/testing/data/mock_app";
import mockDeployments from "~/testing/data/mock_deployments_v2";
import mockEnvironment from "~/testing//data/mock_environment";
import {
  mockFetchDeployments,
  mockDeleteDeployment,
} from "~/testing/nocks/nock_deployments_v2";
import Deployments from "./Deployments";

interface Props {
  app?: App;
  environment?: Environment;
  deployments?: DeploymentV2[];
}

jest.mock("~/utils/helpers/date", () => ({
  timeSince: () => "2 hours",
}));

describe("~/apps/[id]/environments/[env-id]/deployments/Deployments.tsx", () => {
  let wrapper: RenderResult;
  let currentApp: App;
  let currentEnv: Environment;
  let currentDeploys: DeploymentV2[];
  let scope: Scope;

  const createWrapper = ({
    app,
    environment,
    deployments,
  }: Props | undefined = {}) => {
    currentApp = app || mockApp();
    currentEnv = environment || mockEnvironment({ app: currentApp });
    currentDeploys = deployments || mockDeployments();

    scope = mockFetchDeployments({
      envId: currentEnv.id,
      response: { deployments: currentDeploys },
    });

    const memoryRouter = createMemoryRouter([
      {
        path: "*",
        element: (
          <EnvironmentContext.Provider value={{ environment: currentEnv }}>
            <Deployments />
          </EnvironmentContext.Provider>
        ),
      },
    ]);

    wrapper = render(<RouterProvider router={memoryRouter} />);
  };

  test("should list deployments", async () => {
    createWrapper();

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(wrapper.getByText("chore: update packages")).toBeTruthy();
      expect(wrapper.getAllByText("2 hours ago")).toBeTruthy();
      expect(wrapper.getByText("main")).toBeTruthy();
    });
  });

  test.only("should handle deleting deployment", async () => {
    createWrapper();

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(wrapper.getByText("chore: update packages")).toBeTruthy();
    });

    const deleteScope = mockDeleteDeployment({
      appId: currentDeploys[0].appId,
      deploymentId: currentDeploys[0].id,
    });

    const refetchScope = mockFetchDeployments({
      envId: currentEnv.id,
      response: { deployments: [] },
    });

    fireEvent.click(wrapper.getAllByLabelText("expand").at(0)!);

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
      expect(refetchScope.isDone()).toBe(true);
    });
  });

  test("displays an empty list when there are no deployments", async () => {
    createWrapper({ deployments: [] });

    await waitFor(() => {
      expect(wrapper.getByText(/It\'s quite empty in here\./)).toBeTruthy();
      expect(
        wrapper.getByText(
          /Click the Deploy button to start your first deployment\./
        )
      ).toBeTruthy();
    });
  });
});
