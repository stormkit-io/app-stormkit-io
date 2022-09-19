import { RenderResult, waitFor } from "@testing-library/react";
import type { History } from "history";
import React from "react";
import { createMemoryHistory } from "history";
import { Router } from "react-router";
import { render } from "@testing-library/react";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import { mockFetchStatus } from "~/testing/nocks/nock_environment";
import EnvironmentHeader from "./EnvironmentHeader";
import mockApp from "~/testing/data/mock_app";
import mockEnvironments from "~/testing/data/mock_environments";
import nock from "nock/types";

interface WrapperProps {
  app?: App;
  environments?: Environment[];
}

describe("~/pages/apps/[id]/environments/[env-id]/_components/EnvironmentHeader.tsx", () => {
  let wrapper: RenderResult;
  let history: History;
  const defaultApp = mockApp();
  const defaultEnvs = mockEnvironments({ app: defaultApp });

  const createWrapper = ({
    app = defaultApp,
    environments = defaultEnvs,
  }: WrapperProps) => {
    history = createMemoryHistory();
    wrapper = render(
      <Router navigator={history} location={history.location}>
        <AppContext.Provider
          value={{ app, environments, setRefreshToken: () => {} }}
        >
          <EnvironmentContext.Provider value={{ environment: environments[0] }}>
            <EnvironmentHeader />
          </EnvironmentContext.Provider>
        </AppContext.Provider>
      </Router>
    );
  };

  describe("when not yet published", () => {
    beforeEach(() => {
      createWrapper({});
    });

    test("should display the header properly", () => {
      expect(wrapper.container.innerHTML).toContain("fa-globe");
      expect(wrapper.getByText("app.stormkit.io")).toBeTruthy();
      expect(wrapper.getByText("master")).toBeTruthy();
      expect(wrapper.getByText("Not yet published")).toBeTruthy();
    });
  });

  describe("when not yet deployed", () => {
    beforeEach(() => {
      const envs = [...defaultEnvs];
      envs[0].lastDeploy = undefined;
      createWrapper({ environments: envs });
    });

    test("should display the header properly", () => {
      expect(wrapper.container.innerHTML).toContain("fa-globe");
      expect(wrapper.getByText("app.stormkit.io")).toBeTruthy();
      expect(wrapper.getByText("master")).toBeTruthy();
      expect(wrapper.getByText("Not yet deployed")).toBeTruthy();
    });
  });

  describe("when deployed and published", () => {
    let scope: nock.Scope;

    beforeEach(() => {
      const envs = [...defaultEnvs];
      envs[0].lastDeploy = { id: "1231231", createdAt: Date.now(), exit: 0 };
      envs[0].published = ["682381"];

      scope = mockFetchStatus({
        appId: defaultApp.id,
        url: `https://${envs[0].getDomainName?.()}`,
        response: { status: 200 },
      });

      createWrapper({ environments: envs });
    });

    test("should display the header properly", async () => {
      expect(wrapper.container.innerHTML).toContain("spinner");
      expect(wrapper.getByText("app.stormkit.io")).toBeTruthy();
      expect(wrapper.getByText("master")).toBeTruthy();

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
        expect(wrapper.getByText("200")).toBeTruthy();
        expect(wrapper.container.innerHTML).toContain("fa-globe");
      });
    });
  });
});
