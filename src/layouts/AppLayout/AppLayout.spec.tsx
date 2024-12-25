import { RenderResult } from "@testing-library/react";
import { describe, expect, beforeEach, it } from "vitest";
import { AppContext } from "~/pages/apps/[id]/App.context";
import mockApp from "~/testing/data/mock_app";
import mockEnvironments from "~/testing/data/mock_environments";
import { renderWithRouter } from "~/testing/helpers";
import { AppLayout } from "./AppLayout";

interface WrapperProps {
  app?: App;
  environments?: Environment[];
  setRefreshToken?: () => void;
  initialEntries?: string[];
  path?: string;
}

describe("~/layouts/AppLayout/Applayout.tsx", () => {
  let wrapper: RenderResult;
  const defaultApp = mockApp();
  const defaultEnvs = mockEnvironments({ app: defaultApp });

  const createWrapper = ({
    app = defaultApp,
    environments = defaultEnvs,
    setRefreshToken = () => {},
    path = "/apps/:id",
    initialEntries = [`/apps/${app.id}`],
  }: WrapperProps) => {
    wrapper = renderWithRouter({
      path,
      initialEntries,
      el: () => (
        <AppContext.Provider value={{ app, environments, setRefreshToken }}>
          <AppLayout />
        </AppContext.Provider>
      ),
    });
  };

  describe("app menu - with no selected environment", () => {
    beforeEach(() => {
      createWrapper({
        path: "/apps/:id/environments",
        initialEntries: [`/apps/${defaultApp.id}/environments`],
      });
    });

    it("should render the application header correctly", () => {
      expect(wrapper.getByText("stormkit-io/frontend")).toBeTruthy();
    });

    it("should render menu links", () => {
      const links = wrapper
        .getAllByRole("link")
        .map(link => link.getAttribute("href"));

      expect(links).toEqual([
        "/", // Stormkit logo link
        `/apps/${defaultApp.id}/usage`,
        "/personal", // <- My apps Link
        `/apps/${defaultApp.id}/environments`, // <- app display name link
        "https://gitlab.com/stormkit-io/frontend",
        `/apps/${defaultApp.id}/environments`,
        `/apps/${defaultApp.id}/feed`,
        `/apps/${defaultApp.id}/settings`,
      ]);
    });
  });

  describe("app header - with selected environment", () => {
    beforeEach(() => {
      createWrapper({
        path: "/apps/:id/environments/:envId/deployments",
        initialEntries: [
          `/apps/${defaultApp.id}/environments/${defaultEnvs[0].id}/deployments`,
        ],
      });
    });

    it("should render the application header correctly", () => {
      expect(wrapper.getByText("stormkit-io/frontend")).toBeTruthy();
      expect(() => wrapper.getByText("Select an environment")).toThrow();
    });

    it("should render menu links", () => {
      const links = wrapper
        .getAllByRole("link")
        .map(link => link.getAttribute("href"));

      expect(links).toEqual([
        "/", // Stormkit logo link
        `/apps/${defaultApp.id}/usage`,
        "/personal", // <- My apps Link
        `/apps/${defaultApp.id}/environments`, // <- app display name link
        "https://gitlab.com/stormkit-io/frontend",
        `/apps/${defaultApp.id}/environments`,
        `/apps/${defaultApp.id}/feed`,
        `/apps/${defaultApp.id}/settings`,
        `/apps/${defaultApp.id}/environments/${defaultEnvs[0].id}`,
        `/apps/${defaultApp.id}/environments/${defaultEnvs[0].id}/deployments`,
        `/apps/${defaultApp.id}/environments/${defaultEnvs[0].id}/snippets`,
        `/apps/${defaultApp.id}/environments/${defaultEnvs[0].id}/feature-flags`,
        `/apps/${defaultApp.id}/environments/${defaultEnvs[0].id}/function-triggers`,
        `/apps/${defaultApp.id}/environments/${defaultEnvs[0].id}/volumes`,
        `/apps/${defaultApp.id}/environments/${defaultEnvs[0].id}/analytics`,
      ]);
    });
  });
});
