import type { Scope } from "nock/types";
import type { RenderResult } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router";
import { waitFor, fireEvent, render } from "@testing-library/react";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import { mockFetchSnippets } from "~/testing/nocks/nock_snippets";
import mockSnippets from "~/testing/data/mock_snippets";
import mockApp from "~/testing/data/mock_app";
import mockEnvironment from "~/testing/data/mock_environment";
import Snippets from "./Snippets";

interface Props {
  app: App;
  env: Environment;
}

describe("~/pages/apps/[id]/environments/[env-id]/snippets/Snippets.tsx", () => {
  let fetchSnippetsScope: Scope;
  let wrapper: RenderResult;
  let currentApp: App;
  let currentEnv: Environment;
  let snippets = mockSnippets();

  const createWrapper = ({ app, env }: Props) => {
    wrapper = render(
      <MemoryRouter>
        <AppContext.Provider
          value={{
            app,
            environments: [env],
            setRefreshToken: jest.fn(),
          }}
        >
          <EnvironmentContext.Provider value={{ environment: env }}>
            <Snippets />
          </EnvironmentContext.Provider>
        </AppContext.Provider>
      </MemoryRouter>
    );
  };

  describe("with snippets", () => {
    beforeEach(() => {
      currentApp = mockApp();
      currentEnv = mockEnvironment({ app: currentApp });
      snippets = mockSnippets();
      fetchSnippetsScope = mockFetchSnippets({
        appId: currentApp.id,
        envName: currentEnv.name,
        response: { snippets },
      });

      createWrapper({ app: currentApp, env: currentEnv });
    });

    test("should load snippets", async () => {
      await waitFor(() => {
        expect(fetchSnippetsScope.isDone()).toBe(true);
        expect(wrapper.getByText(snippets.head[0].title)).toBeTruthy();
        expect(wrapper.getByText(snippets.body[0].title)).toBeTruthy();
      });
    });

    test("should have a new button which opens a modal", async () => {
      fireEvent.click(wrapper.getByText("New snippet"));

      await waitFor(() => {
        expect(wrapper.getByText("Create snippet")).toBeTruthy();
      });
    });
  });

  describe("with empty snippets list", () => {
    beforeEach(() => {
      currentApp = mockApp();
      currentEnv = mockEnvironment({ app: currentApp });
      fetchSnippetsScope = mockFetchSnippets({
        appId: currentApp.id,
        envName: currentEnv.name,
        response: { snippets: { head: [], body: [] } },
      });

      createWrapper({ app: currentApp, env: currentEnv });
    });

    test("should load an empty list", async () => {
      await waitFor(() => {
        expect(fetchSnippetsScope.isDone()).toBe(true);
      });

      expect(wrapper.getByText("It is quite empty here.")).toBeTruthy();
    });
  });
});
