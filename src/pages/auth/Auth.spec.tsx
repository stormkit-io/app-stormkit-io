import * as router from "react-router";
import { mockUser } from "~/testing/data";
import { render, waitFor, RenderResult } from "@testing-library/react";
import { AuthContext, AuthContextProps } from "./Auth.context";
import Auth from "./Auth";

describe("~/pages/auth/Auth.tsx", () => {
  let wrapper: RenderResult;
  let navigate: jest.Func;

  const createWrapper = (context?: AuthContextProps) => {
    navigate = jest.fn();
    jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);

    const memoryRouter = router.createMemoryRouter([
      {
        path: "*",
        element: (
          <AuthContext.Provider value={{ user: mockUser(), ...context }}>
            <Auth />
          </AuthContext.Provider>
        ),
      },
    ]);

    wrapper = render(<router.RouterProvider router={memoryRouter} />);
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

  describe("when user is logged in and redirect is provided", () => {
    beforeEach(() => {
      mockUseLocation({ search: "?redirect=/apps" });
      createWrapper();
    });

    test("redirects user to the given page", async () => {
      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith("/apps");
      });
    });
  });

  describe("when user is logged in and redirect is not provided", () => {
    beforeEach(() => {
      mockUseLocation();
      createWrapper();
    });

    test("redirects user to the home page", async () => {
      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith("/");
      });
    });
  });

  describe("when user is not logged in", () => {
    let loginOauthSpy;

    beforeEach(() => {
      loginOauthSpy = jest.fn();
      mockUseLocation();
      createWrapper({ user: undefined, loginOauth: loginOauthSpy });
    });

    test("displays some text", async () => {
      await waitFor(() => {
        expect(wrapper.getByText(/SSL/)).toBeTruthy();
        expect(wrapper.getByText(/automated SSL/)).toBeTruthy();
        expect(wrapper.getByText(/Serverless functions/)).toBeTruthy();
      });
    });

    test("displays three buttons", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("GitHub")).toBeTruthy();
        expect(wrapper.getByText("Bitbucket")).toBeTruthy();
        expect(wrapper.getByText("GitLab")).toBeTruthy();
      });
    });
  });

  describe("when there is a login error", () => {
    beforeEach(() => {
      mockUseLocation();
      createWrapper({
        user: undefined,
        authError: "Something went wrong while logging in.",
      });
    });

    test("displays an infobox with the authError", async () => {
      await waitFor(() => {
        expect(
          wrapper.getByText("Something went wrong while logging in.")
        ).toBeTruthy();
      });
    });
  });
});
