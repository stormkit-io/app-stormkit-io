import { fireEvent, RenderResult } from "@testing-library/react";
import type { History } from "history";
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
    expect(wrapper.getAllByRole("link").at(14)?.getAttribute("href")).toBe(
      `/apps/${defaultApp.id}/usage`
    );
  });

  describe("deploy now", () => {
    test("should render deploy now button", () => {
      expect(wrapper.getByLabelText("Deploy now")).toBeTruthy();
    });

    test("should open a modal when deploy is now clicked", () => {
      expect(() => wrapper.getByText("Start a deployment")).toThrow();
      fireEvent.click(wrapper.getByLabelText("Deploy now"));
      expect(wrapper.getByText("Start a deployment")).toBeTruthy();
    });
  });
});
