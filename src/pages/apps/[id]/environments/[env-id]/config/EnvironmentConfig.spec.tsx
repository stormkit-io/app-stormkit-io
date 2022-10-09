import { RenderResult, waitFor } from "@testing-library/react";
import { Scope } from "nock/types";
import { MemoryRouter } from "react-router";
import React from "react";
import { render } from "@testing-library/react";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import { AppContext } from "~/pages/apps/[id]/App.context";
import mockApp from "~/testing/data/mock_app";
import mockEnvironments from "~/testing/data/mock_environments";
import { mockFetchRepoMeta } from "~/testing/nocks/nock_environment";
import EnvironmentConfig from "./EnvironmentConfig";

interface WrapperProps {
  app?: App;
  environments?: Environment[];
  setRefreshToken?: () => void;
}

describe("~/pages/apps/[id]/environments/[env-id]/config/EnvironmentConfig.tsx", () => {
  let fetchRepoMetaScope: Scope;
  let wrapper: RenderResult;
  let currentApp: App;
  let currentEnv: Environment;
  let currentEnvs: Environment[];

  const createWrapper = ({
    app,
    environments,
    setRefreshToken = () => {},
  }: WrapperProps) => {
    currentApp = app || mockApp();
    currentEnvs = environments || mockEnvironments({ app: currentApp });
    currentEnv = currentEnvs[0];

    fetchRepoMetaScope = mockFetchRepoMeta({
      appId: currentApp.id,
      name: currentEnv.name,
    });

    wrapper = render(
      <MemoryRouter>
        <AppContext.Provider
          value={{
            app: currentApp,
            environments: currentEnvs,
            setRefreshToken,
          }}
        >
          <EnvironmentContext.Provider value={{ environment: currentEnv }}>
            <EnvironmentConfig />
          </EnvironmentContext.Provider>
        </AppContext.Provider>
      </MemoryRouter>
    );
  };

  test("should fetch the repo meta", async () => {
    createWrapper({});

    await waitFor(() => {
      expect(fetchRepoMetaScope.isDone()).toBe(true);
    });
  });

  test("should load the form properly", () => {
    createWrapper({});
    expect(wrapper.getByLabelText("Branch")).toBeTruthy();
    expect(wrapper.getByDisplayValue("master")).toBeTruthy();

    expect(wrapper.getByLabelText("Name")).toBeTruthy();

    // There are multiple due to env vars, so use findAll.
    expect(wrapper.getAllByDisplayValue("production")).toBeTruthy();
  });

  test("should contain tabs to switch views", () => {
    createWrapper({});
    expect(wrapper.getByText("Configuration")).toBeTruthy();
    expect(wrapper.getByText("Custom Storage")).toBeTruthy();
  });
});
