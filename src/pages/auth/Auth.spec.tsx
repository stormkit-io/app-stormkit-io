import React from "react";
import router from "react-router";
import { Router } from "react-router-dom";
import { createMemoryHistory, MemoryHistory } from "history";
import { mockUser } from "~/testing/data";
import { render, waitFor, RenderResult } from "@testing-library/react";
import { AuthContext, AuthContextProps } from "./Auth.context";
import Auth from "./Auth";

describe("~/pages/auth/Auth.tsx", () => {
  let wrapper: RenderResult;
  let history: MemoryHistory;

  const createWrapper = (context?: AuthContextProps) => {
    history = createMemoryHistory();
    wrapper = render(
      <Router history={history}>
        <AuthContext.Provider value={{ user: mockUser(), ...context }}>
          <Auth />
        </AuthContext.Provider>
      </Router>
    );
  };

  const mockUseLocation = ({ pathname = "", search = "" } = {}) => {
    jest.spyOn(router, "useLocation").mockReturnValue({
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
        expect(history.location.pathname).toBe("/apps");
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
        expect(history.location.pathname).toBe("/");
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
