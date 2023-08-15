import type { Scope } from "nock";
import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router";
import { AppContext } from "~/pages/apps/[id]/App.context";
import mockApp from "~/testing/data/mock_app";
import mockDeployment from "~/testing/data/mock_deployment";
import mockEnvironment from "~/testing//data/mock_environment";
import { mockFetchDeploymentLogs } from "~/testing/nocks/nock_logs";
import RuntimeLogs from "./RuntimeLogs";

interface Props {
  app?: App;
  deployment?: Deployment;
  environment?: Environment;
  totalPage?: number;
}

describe("~/pages/apps/[id]/environments/[env-id]/deployments/runtime-logs/RuntimeLogs.spec.tsx", () => {
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
    totalPage = 0,
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

    scope = mockFetchDeploymentLogs({
      appId: currentApp.id,
      deploymentId: currentDeploy.id,
      page: 0,
      response: {
        logs: [
          {
            appId: "592128846360",
            envId: "483571891194",
            deploymentId: "70884402118696",
            data: "START RequestId: 7c64e362-004c-40f8-a325-ef9af252cd8d Version: 1\n2022-10-19T16:54:01.246Z\t7c64e362-004c-40f8-a325-ef9af252cd8d\tINFO\tsample log from sample-project 1\nEND RequestId: 7c64e362-004c-40f8-a325-ef9af252cd8d\nREPORT RequestId: 7c64e362-004c-40f8-a325-ef9af252cd8d\tDuration: 283.86 ms\tBilled Duration: 284 ms\tMemory Size: 512 MB\tMax Memory Used: 66 MB\tInit Duration: 150.46 ms\t\n",
            timestamp: "1666198441",
          },
          {
            appId: "592128846360",
            envId: "483571891194",
            deploymentId: "70884402118696",
            data: "START RequestId: bd9c372e-3469-46e8-ae51-abe40174ef05 Version: 1\n2022-10-19T13:53:24.661Z\tbd9c372e-3469-46e8-ae51-abe40174ef05\tINFO\tsample log from sample-project 2\nEND RequestId: bd9c372e-3469-46e8-ae51-abe40174ef05\nREPORT RequestId: bd9c372e-3469-46e8-ae51-abe40174ef05\tDuration: 14.53 ms\tBilled Duration: 15 ms\tMemory Size: 512 MB\tMax Memory Used: 69 MB\t\n",
            timestamp: "1666187604",
          },
          {
            appId: "592128846360",
            envId: "483571891194",
            deploymentId: "70884402118696",
            data: "START RequestId: 3c316656-f979-4eaf-a373-6fb7f4de4634 Version: 1\n2022-10-19T13:49:30.129Z\t3c316656-f979-4eaf-a373-6fb7f4de4634\tINFO\tsample log from sample-project 3\nEND RequestId: 3c316656-f979-4eaf-a373-6fb7f4de4634\nREPORT RequestId: 3c316656-f979-4eaf-a373-6fb7f4de4634\tDuration: 65.49 ms\tBilled Duration: 66 ms\tMemory Size: 512 MB\tMax Memory Used: 69 MB\t\n",
            timestamp: "1666187370",
          },
        ],
        totalPage,
      },
    });

    const memoryRouter = createMemoryRouter(
      [
        {
          path: "/apps/:appId/environments/:envId/deployments/:deploymentId/runtime-logs",
          element: (
            <AppContext.Provider
              value={{
                app: currentApp,
                environments: [currentEnv],
                setRefreshToken: jest.fn(),
              }}
            >
              <RuntimeLogs />
            </AppContext.Provider>
          ),
        },
      ],
      {
        initialIndex: 0,
        initialEntries: [
          `/apps/${currentApp.id}/environments/${currentEnv.id}/deployments/${currentDeploy.id}/runtime-logs`,
        ],
      }
    );

    wrapper = render(<RouterProvider router={memoryRouter} />);
  };

  test("should contain a link back to the deployment page", async () => {
    createWrapper();

    await waitFor(() => {
      expect(wrapper.getByText("Runtime logs")).toBeTruthy();
      expect(
        wrapper
          .getByText(new RegExp(`\#${currentDeploy.id}`))
          .getAttribute("href")
      ).toBe("/apps/1/environments/1429333243019/deployments/1050101");
    });
  });

  test("should display logs", async () => {
    createWrapper();

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(
        wrapper.getByText("sample log from sample-project 1")
      ).toBeTruthy();
      expect(
        wrapper.getByText("sample log from sample-project 2")
      ).toBeTruthy();
      expect(
        wrapper.getByText("sample log from sample-project 3")
      ).toBeTruthy();
    });
  });

  test("should paginate", async () => {
    createWrapper({ totalPage: 2 });

    await waitFor(() => {
      expect(wrapper.getByText("Load more logs")).toBeTruthy();
    });

    const paginationScope = mockFetchDeploymentLogs({
      appId: currentApp.id,
      deploymentId: currentDeploy.id,
      page: 1,
      response: {
        totalPage: 2,
        logs: [
          {
            appId: currentApp.id,
            envId: currentEnv.id!,
            deploymentId: currentDeploy.id,
            data: "Hello from a second page log",
            timestamp: "1666198441",
          },
        ],
      },
    });

    fireEvent.click(wrapper.getByText("Load more logs"));

    await waitFor(() => {
      expect(paginationScope.isDone()).toBe(true);
      expect(wrapper.getByText("Hello from a second page log")).toBeTruthy();
    });
  });
});
