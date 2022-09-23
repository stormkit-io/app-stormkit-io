import type { Scope } from "nock";
import React from "react";
import {
  fireEvent,
  render,
  RenderResult,
  waitFor,
} from "@testing-library/react";
import { createMemoryHistory, History } from "history";
import { Router } from "react-router-dom";
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

jest.mock("~/utils/helpers/deployments", () => ({
  formattedDate: () => "21.09.2022 - 21:30",
}));

describe("~/apps/[id]/environments/[env-id]/deployments/Deployments.tsx", () => {
  let wrapper: RenderResult;
  let history: History;
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

    history = createMemoryHistory();
    wrapper = render(
      <Router navigator={history} location={history.location}>
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
      </Router>
    );
  };

  test("should list deployments", async () => {
    createWrapper();

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(wrapper.getByText("chore: bump version")).toBeTruthy();
      expect(wrapper.getByText("21.09.2022 - 21:30")).toBeTruthy();
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
});
