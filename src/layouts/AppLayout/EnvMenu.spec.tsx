import {
  RenderResult,
  fireEvent,
  waitFor,
  getByLabelText,
} from "@testing-library/react";
import * as router from "react-router";
import { render } from "@testing-library/react";
import { AppContext } from "~/pages/apps/[id]/App.context";
import mockApp from "~/testing/data/mock_app";
import mockEnvironments from "~/testing/data/mock_environments";
import EnvMenu from "./EnvMenu";

interface WrapperProps {
  app?: App;
  environments?: Environment[];
  setRefreshToken?: () => void;
}

describe("~/layouts/AppLayout/EnvMenu.tsx", () => {
  let wrapper: RenderResult;
  let navigateSpy: jest.Mock;
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
          path: "/apps/:id/environments/:envId",
          element: (
            <AppContext.Provider value={{ app, environments, setRefreshToken }}>
              <EnvMenu />
            </AppContext.Provider>
          ),
        },
      ],
      {
        initialEntries: [`/apps/${app.id}/environments/${environments[0].id}`],
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

  const mockUseNavigate = () => {
    navigateSpy = jest.fn();
    jest.spyOn(router, "useNavigate").mockReturnValue(navigateSpy);
  };

  beforeEach(() => {
    mockUseLocation({
      pathname: `/apps/${defaultApp.id}/environments/${defaultEnvs[0].id}`,
    });

    mockUseNavigate();

    createWrapper({});
  });

  test("should have the environment selector rendered correctly", async () => {
    const select = wrapper.getByLabelText("Environment selector");
    expect(select).toBeTruthy();
    fireEvent.mouseDown(select.firstChild!);

    await waitFor(() => {
      expect(
        getByLabelText(document.body, "development environment")
      ).toBeTruthy();
    });

    fireEvent.click(getByLabelText(document.body, "development environment"));

    await waitFor(() => {
      expect(navigateSpy).toHaveBeenCalledWith(
        `/apps/1/environments/${defaultEnvs[1].id}`
      );
    });
  });

  test("should render menu links", () => {
    const links = wrapper
      .getAllByRole("link")
      .map(link => link.getAttribute("href"));

    expect(links).toEqual([
      `/apps/${defaultApp.id}/environments/${defaultEnvs[0].id}`,
      `/apps/${defaultApp.id}/environments/${defaultEnvs[0].id}/deployments`,
      `/apps/${defaultApp.id}/environments/${defaultEnvs[0].id}/snippets`,
      `/apps/${defaultApp.id}/environments/${defaultEnvs[0].id}/feature-flags`,
      `/apps/${defaultApp.id}/environments/${defaultEnvs[0].id}/key-value`,
      `/apps/${defaultApp.id}/environments/${defaultEnvs[0].id}/function-triggers`,
      `/apps/${defaultApp.id}/environments/${defaultEnvs[0].id}/analytics`,
    ]);
  });
});
