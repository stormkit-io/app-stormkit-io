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
import mockFunctionTriggers from "~/testing/data/mock_function_triggers";
import mockEnvironment from "~/testing//data/mock_environment";
import * as mockActions from "~/testing/nocks/nock_function_triggers";
import FunctionTriggers from "./FunctionTriggers";

const { mockFetchFunctionTriggers, mockDeleteFunctionTrigger } = mockActions;

interface Props {
  app?: App;
  environment?: Environment;
  triggers?: FunctionTrigger[];
}

describe("~/apps/[id]/environments/[env-id]/function-triggers/FunctionTriggers.tsx", () => {
  let wrapper: RenderResult;
  let history: History;
  let currentApp: App;
  let currentEnv: Environment;
  let currentTriggers: FunctionTrigger[];
  let scope: Scope;

  const createWrapper = ({
    app,
    environment,
    triggers,
  }: Props | undefined = {}) => {
    currentApp = app || mockApp();
    currentEnv = environment || mockEnvironment({ app: currentApp });
    currentTriggers = triggers || mockFunctionTriggers();

    scope = mockFetchFunctionTriggers({
      appId: currentApp.id,
      envId: currentEnv.id!,
      response: currentTriggers,
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
            <FunctionTriggers />
          </EnvironmentContext.Provider>
        </AppContext.Provider>
      </Router>
    );
  };

  test("should list function triggers", async () => {
    createWrapper();

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(
        wrapper.getByText("https://grinmesquite-pzqmep.stormkit.dev/api/test")
      ).toBeTruthy();
      expect(wrapper.getByText("2 0 2 * *")).toBeTruthy();
    });
  });

  test("should handle deleting function trigger", async () => {
    createWrapper();

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(
        wrapper.getByText("https://grinmesquite-pzqmep.stormkit.dev/api/test")
      ).toBeTruthy();
    });

    const deleteScope = mockDeleteFunctionTrigger({
      appId: currentApp.id,
      tfid: currentTriggers[0].id!,
    });

    fireEvent.click(wrapper.getByLabelText("expand"));

    await waitFor(() => {
      expect(wrapper.getByText("Delete")).toBeTruthy();
    });

    fireEvent.click(wrapper.getByText("Delete"));

    await waitFor(() => {
      expect(wrapper.getByText("Yes, continue")).toBeTruthy();
    });

    const refetchScope = mockFetchFunctionTriggers({
      appId: currentApp.id,
      envId: currentEnv.id!,
      response: currentTriggers,
    });

    fireEvent.click(wrapper.getByText("Yes, continue"));

    await waitFor(() => {
      expect(deleteScope.isDone()).toBe(true);
      expect(refetchScope.isDone()).toBe(true);
    });
  });

  test("displays an empty list when there are no function triggers", async () => {
    createWrapper({ triggers: [] });

    await waitFor(() => {
      expect(wrapper.getByText("It is quite empty here.")).toBeTruthy();
    });
  });
});
