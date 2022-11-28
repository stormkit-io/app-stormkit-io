import { RenderResult } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router";
import { Routes, Route } from "react-router-dom";
import { render, waitFor } from "@testing-library/react";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import mockApp from "~/testing/data/mock_app";
import mockEnvironment from "~/testing/data/mock_environment";
import mockRecords from "~/testing/data/mock_collection_records";
import { mockFetchRecords } from "~/testing/nocks/nock_datastore";
import Records from "./Records";

interface Props {
  app: App;
  env: Environment;
}

describe("~/pages/apps/[id]/environments/[env-id]/datastore/Records.spec.tsx", () => {
  let wrapper: RenderResult;
  let currentApp: App;
  let currentEnv: Environment;
  let records: CollectionRecord[];

  const createWrapper = ({ app, env }: Props) => {
    wrapper = render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: `/apps/${app.id}/environments/${env.id}/data-store/users`,
          },
        ]}
        initialIndex={0}
      >
        <Routes>
          <Route
            path="/apps/:id/environments/:eid/data-store/:collection"
            element={
              <AppContext.Provider
                value={{
                  app,
                  environments: [env],
                  setRefreshToken: jest.fn(),
                }}
              >
                <EnvironmentContext.Provider value={{ environment: env }}>
                  <Records />
                </EnvironmentContext.Provider>
              </AppContext.Provider>
            }
          />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    currentApp = mockApp();
    currentEnv = mockEnvironment({ app: currentApp });
    records = mockRecords();

    mockFetchRecords({
      appId: currentApp.id,
      envId: currentEnv.id!,
      collectionName: "users",
      response: records,
    });

    createWrapper({ app: currentApp, env: currentEnv });
  });

  test("should list records", async () => {
    expect(wrapper.container.innerHTML).toContain("spinner");
    expect(records.length).toBe(2);

    records.forEach(async ({ firstName, lastName }, i) => {
      await waitFor(() => {
        expect(
          wrapper.getByText(
            `{ "firstName": "${firstName}", "lastName": "${lastName}" }`
          )
        ).toBeTruthy();
      });
    });
  });
});
