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

jest.mock("@codemirror/lang-json", () => ({ json: jest.fn() }));
jest.mock("@uiw/react-codemirror", () => ({ value }: { value: string }) => (
  <>{value}</>
));

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
      verified: true,
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
        response: { snippets, pagination: { hasNextPage: false } },
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
        expect(wrapper.getByText(`${s1.title}`)).toBeTruthy();
        expect(wrapper.getByText(`${s2.title}`)).toBeTruthy();
      });
    });

    test("should have a new button which opens a modal", async () => {
      fireEvent.click(wrapper.getByText("New Snippet"));

      const fetchDomainsScopeModal = mockFetchDomains({
        appId: currentApp.id,
        envId: currentEnv.id!,
        verified: true,
        response: { domains: [] },
      });

      await waitFor(() => {
        expect(fetchDomainsScopeModal.isDone()).toBe(true);
      });
    });
  });

  describe("with snippets - pagination", () => {
    beforeEach(() => {
      currentApp = mockApp();
      currentEnv = mockEnvironment({ app: currentApp });
      snippets = mockSnippets();
      fetchSnippetsScope = mockFetchSnippets({
        appId: currentApp.id,
        envId: currentEnv.id!,
        response: {
          snippets,
          pagination: { hasNextPage: true, afterId: "410" },
        },
      });

      createWrapper({ app: currentApp, env: currentEnv });
    });

    test("should have a load more button", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("Load more")).toBeTruthy();
      });

      fireEvent.click(wrapper.getByText("Load more"));

      const nextSnippets = mockSnippets();
      nextSnippets[0].id = "3";
      nextSnippets[0].title = "Newly loaded snippet - 1";
      nextSnippets[1].id = "4";
      nextSnippets[1].title = "Newly loaded snippet - 2";

      fetchSnippetsScope = mockFetchSnippets({
        appId: currentApp.id,
        envId: currentEnv.id!,
        afterId: "410",
        response: {
          snippets: nextSnippets,
          pagination: { hasNextPage: false },
        },
      });

      await waitFor(() => {
        expect(fetchSnippetsScope.isDone()).toBe(true);
        expect(wrapper.getByText(`${snippets[0].title}`)).toBeTruthy();
        expect(wrapper.getByText(`${snippets[1].title}`)).toBeTruthy();
        expect(wrapper.getByText(`${nextSnippets[0].title}`)).toBeTruthy();
        expect(wrapper.getByText(`${nextSnippets[1].title}`)).toBeTruthy();
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
        response: { snippets: [], pagination: { hasNextPage: false } },
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
