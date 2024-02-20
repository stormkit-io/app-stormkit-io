import type { Scope } from "nock/types";
import type { RenderResult } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { waitFor, fireEvent, render } from "@testing-library/react";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import { mockFetchSnippets } from "~/testing/nocks/nock_snippets";
import { mockFetchDomains } from "~/testing/nocks/nock_domains";
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
  let fetchDomainsScope: Scope;
  let wrapper: RenderResult;
  let currentApp: App;
  let currentEnv: Environment;
  let snippets = mockSnippets();

  const createWrapper = ({ app, env }: Props) => {
    fetchDomainsScope = mockFetchDomains({
      appId: app.id,
      envId: env.id!,
      response: { domains: [] },
    });

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
        envId: currentEnv.id!,
        response: { snippets },
      });

      createWrapper({ app: currentApp, env: currentEnv });
    });

    test("should fetch domains", async () => {
      await waitFor(() => {
        expect(fetchDomainsScope.isDone()).toBe(true);
      });
    });

    test("should load snippets", async () => {
      const s1 = snippets[0];
      const s2 = snippets[0];

      await waitFor(() => {
        expect(fetchSnippetsScope.isDone()).toBe(true);
        expect(wrapper.getByText(`#${s1.id} ${s1.title}`)).toBeTruthy();
        expect(wrapper.getByText(`#${s2.id} ${s2.title}`)).toBeTruthy();
      });
    });

    test("should have a new button which opens a modal", async () => {
      fireEvent.click(wrapper.getByText("New Snippet"));

      await waitFor(() => {
        expect(
          wrapper.getByText(
            /Turn this feature on to automatically publish successful deployments on the default branch./
          )
        ).toBeTruthy();
      });
    });
  });

  describe("with empty snippets list", () => {
    beforeEach(() => {
      currentApp = mockApp();
      currentEnv = mockEnvironment({ app: currentApp });
      fetchSnippetsScope = mockFetchSnippets({
        appId: currentApp.id,
        envId: currentEnv.id!,
        response: { snippets: [] },
      });

      createWrapper({ app: currentApp, env: currentEnv });
    });

    test("should load an empty list", async () => {
      await waitFor(() => {
        expect(fetchSnippetsScope.isDone()).toBe(true);
      });

      expect(wrapper.getByText(/It\'s quite empty in here\./)).toBeTruthy();
    });
  });
});
