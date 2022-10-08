import type { History } from "history";
import { RenderResult } from "@testing-library/react";
import React from "react";
import * as router from "react-router";
import { createMemoryHistory } from "history";
import { render } from "@testing-library/react";
import { AuthContext } from "~/pages/auth/Auth.context";
import mockApp from "~/testing/data/mock_app";
import mockEnvironments from "~/testing/data/mock_environments";
import AppMenu from "./AppMenu";
import { mockUser } from "~/testing/data";

interface WrapperProps {
  app?: App;
  environments?: Environment[];
  setRefreshToken?: () => void;
}

describe("~/layouts/AppLayout/Applayout.tsx", () => {
  let wrapper: RenderResult;
  let history: History;
  const defaultApp = mockApp();
  const defaultEnvs = mockEnvironments({ app: defaultApp });

  const createWrapper = ({
    app = defaultApp,
    environments = defaultEnvs,
  }: WrapperProps) => {
    const { Router } = router;
    history = createMemoryHistory();
    wrapper = render(
      <Router navigator={history} location={history.location}>
        <AuthContext.Provider value={{ user: mockUser() }}>
          <AppMenu
            app={app}
            environments={environments}
            envId={environments[0].id!}
          />
        </AuthContext.Provider>
      </Router>
    );
  };

  beforeEach(() => {
    createWrapper({});
  });

  test("should display usage button", () => {
    expect(wrapper.getByLabelText("Usage").getAttribute("href")).toBe(
      `/apps/${defaultApp.id}/usage`
    );
  });
});
