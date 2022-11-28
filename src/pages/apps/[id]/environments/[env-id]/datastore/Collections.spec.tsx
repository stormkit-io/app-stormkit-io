import { RenderResult } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router";
import { render, waitFor } from "@testing-library/react";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import mockApp from "~/testing/data/mock_app";
import mockEnvironment from "~/testing/data/mock_environment";
import mockCollections from "~/testing/data/mock_collections";
import { mockFetchCollections } from "~/testing/nocks/nock_datastore";
import Collections from "./Collections";

interface Props {
  app: App;
  env: Environment;
}

describe("~/pages/apps/[id]/environments/[env-id]/datastore/Collections.spec.tsx", () => {
  let wrapper: RenderResult;
  let currentApp: App;
  let currentEnv: Environment;
  let collections: Collection[];

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
            <Collections />
          </EnvironmentContext.Provider>
        </AppContext.Provider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    currentApp = mockApp();
    currentEnv = mockEnvironment({ app: currentApp });
    collections = mockCollections();

    mockFetchCollections({
      appId: currentApp.id,
      envId: currentEnv.id!,
      response: collections,
    });

    createWrapper({ app: currentApp, env: currentEnv });
  });

  test("should list records", async () => {
    expect(wrapper.container.innerHTML).toContain("spinner");
    expect(collections.length).toBe(2);

    collections.forEach(async ({ count, name }, i) => {
      await waitFor(() => {
        expect(wrapper.getByText(`${count} records`)).toBeTruthy();
        expect(wrapper.getByText(`${name}`)).toBeTruthy();
      });
    });
  });
});
