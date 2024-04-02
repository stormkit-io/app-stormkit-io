import { RenderResult, waitFor } from "@testing-library/react";
import * as router from "react-router";
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
  const defaultApp = mockApp();
  const defaultEnvs = mockEnvironments({ app: defaultApp });

  const createWrapper = ({
    app = defaultApp,
    environments = defaultEnvs,
    setRefreshToken = () => {},
  }: WrapperProps) => {
    const { RouterProvider } = router;
    const memoryRouter = router.createMemoryRouter(
      [
        {
          path: "/apps/:id/*",
          element: (
            <AppContext.Provider value={{ app, environments, setRefreshToken }}>
              <AppLayout />
            </AppContext.Provider>
          ),
        },
      ],
      {
        initialEntries: [`/apps/${app.id}`],
        initialIndex: 0,
      }
    );

    wrapper = render(<RouterProvider router={memoryRouter} />);
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

  describe("app menu - with no selected environment", () => {
    beforeEach(() => {
      mockUseLocation({ pathname: `/apps/${defaultApp.id}/environments` });
      createWrapper({});
    });

    test("should render the application header correctly", () => {
      expect(wrapper.getByText("stormkit-io/frontend")).toBeTruthy();
    });

    test("should render menu links", () => {
      const links = wrapper
        .getAllByRole("link")
        .map(link => link.getAttribute("href"));

      expect(links).toEqual([
        "/", // Stormkit logo link
        `/apps/${defaultApp.id}/usage`,
        "https://gitlab.com/stormkit-io/frontend",
        `/apps/${defaultApp.id}/environments`,
        `/apps/${defaultApp.id}/settings`,
      ]);
    });
  });

  describe("app header - with selected environment", () => {
    beforeEach(() => {
      mockUseLocation({
        pathname: `/apps/${defaultApp.id}/environments/${defaultEnvs[0].id}/deployments`,
      });
      createWrapper({});
    });

    test("should render the application header correctly", () => {
      expect(wrapper.getByText("stormkit-io/frontend")).toBeTruthy();
      expect(() => wrapper.getByText("Select an environment")).toThrow();
    });

    test("should render menu links", () => {
      const links = wrapper
        .getAllByRole("link")
        .map(link => link.getAttribute("href"));

      expect(links).toEqual([
        "/", // Stormkit logo link
        `/apps/${defaultApp.id}/usage`,
        "https://gitlab.com/stormkit-io/frontend",
        `/apps/${defaultApp.id}/environments`,
        `/apps/${defaultApp.id}/settings`,
        `/apps/${defaultApp.id}/environments/${defaultEnvs[0].id}`,
        `/apps/${defaultApp.id}/environments/${defaultEnvs[0].id}/deployments`,
        `/apps/${defaultApp.id}/environments/${defaultEnvs[0].id}/snippets`,
        `/apps/${defaultApp.id}/environments/${defaultEnvs[0].id}/feature-flags`,
        `/apps/${defaultApp.id}/environments/${defaultEnvs[0].id}/function-triggers`,
        `/apps/${defaultApp.id}/environments/${defaultEnvs[0].id}/key-value`,
        `/apps/${defaultApp.id}/environments/${defaultEnvs[0].id}/analytics`,
      ]);
    });
  });

  describe("with SK_DATA_STORE feature flag turned on", () => {
    beforeEach(() => {
      const app = mockApp();
      app.featureFlags = { SK_DATA_STORE: true };
      mockUseLocation({ pathname: `/apps/${defaultApp.id}/environments` });
      createWrapper({ app });
    });

    test("should display data store link", async () => {
      const links = wrapper
        .getAllByRole("link")
        .map(link => link.getAttribute("href"));

      await waitFor(() => {
        expect(links).toEqual([
          "/", // Stormkit logo link
          `/apps/${defaultApp.id}/usage`,
          "https://gitlab.com/stormkit-io/frontend",
          `/apps/${defaultApp.id}/environments`,
          `/apps/${defaultApp.id}/settings`,
        ]);
      });
    });
  });
});
