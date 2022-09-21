import type { RenderResult } from "@testing-library/react";
import type { History } from "history";
import React from "react";
import * as router from "react-router";
import { createMemoryHistory } from "history";
import { render } from "@testing-library/react";
import { AppContext } from "~/pages/apps/[id]/App.context";
import mockApp from "~/testing/data/mock_app";
import mockEnvironments from "~/testing/data/mock_environments";
import { AppLayout } from "./AppLayout";

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
    setRefreshToken = () => {},
  }: WrapperProps) => {
    const { Router, Route, Routes } = router;
    history = createMemoryHistory({
      initialEntries: [`/apps/${app.id}`],
      initialIndex: 0,
    });
    wrapper = render(
      <Router navigator={history} location={history.location}>
        <Routes>
          <Route
            path="/apps/:id/*"
            element={
              <AppContext.Provider
                value={{ app, environments, setRefreshToken }}
              >
                <AppLayout />
              </AppContext.Provider>
            }
          />
        </Routes>
      </Router>
    );
  };

  const mockUseLocation = ({ pathname = "", search = "" } = {}) => {
    jest.spyOn(router, "useLocation").mockReturnValue({
      key: "",
      state: {},
      hash: "",
      pathname,
      search,
    });
  };

  describe("app header - with environments", () => {
    beforeEach(() => {
      mockUseLocation({ pathname: `/apps/${defaultApp.id}/environments` });
      createWrapper({});
    });

    test("should render the application header correctly", () => {
      expect(wrapper.getByText("stormkit-io/frontend")).toBeTruthy();
      expect(wrapper.getByText("production")).toBeTruthy();
    });

    test("should render menu links", () => {
      const links = wrapper
        .getAllByRole("link")
        .map(link => link.getAttribute("href"));

      expect(links).toEqual([
        "/", // Back button in the header
        `/apps/${defaultApp.id}/team`,
        `/apps/${defaultApp.id}/settings`,
        "/", // Stormkit logo link
        `/apps/${defaultApp.id}/environments`,
        `/apps/${defaultApp.id}/environments/${defaultEnvs[0].id}/deployments`,
      ]);
    });
  });

  describe("app header - without environments", () => {
    beforeEach(() => {
      mockUseLocation({ pathname: `/settings` });
      createWrapper({});
    });

    test("should render the application header correctly", () => {
      expect(wrapper.getByText("stormkit-io/frontend")).toBeTruthy();
      expect(() => wrapper.getByText("production")).toThrow();
    });

    test("should render menu links", () => {
      const links = wrapper
        .getAllByRole("link")
        .map(link => link.getAttribute("href"));

      expect(links).toEqual([
        "/", // Back button in the header
        `/apps/${defaultApp.id}/team`,
        `/apps/${defaultApp.id}/settings`,
        "/", // Stormkit logo link
        `/apps/${defaultApp.id}/environments`,
        `/apps/${defaultApp.id}/environments/${defaultEnvs[0].id}/deployments`,
      ]);
    });
  });
});
