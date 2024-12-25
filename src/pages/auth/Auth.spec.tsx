import type { Scope } from "nock";
import { describe, expect, beforeEach, it, vi } from "vitest";
import { mockUser } from "~/testing/data";
import { waitFor, RenderResult } from "@testing-library/react";
import { AuthContext, AuthContextProps } from "./Auth.context";
import { mockFetchAuthProviders } from "~/testing/nocks/nock_auth";
import { renderWithRouter } from "~/testing/helpers";
import Auth from "./Auth";

declare const global: {
  NavigateMock: any;
};

interface Props {
  context?: AuthContextProps;
  path?: string;
}

describe("~/pages/auth/Auth.tsx", () => {
  let wrapper: RenderResult;
  let scope: Scope;

  const createWrapper = ({ context, path }: Props = {}) => {
    wrapper = renderWithRouter({
      initialEntries: [path || "/"],
      el: () => (
        <AuthContext.Provider value={{ user: mockUser(), ...context }}>
          <Auth />
        </AuthContext.Provider>
      ),
    });
  };

  describe("when user is logged in and redirect is provided", () => {
    beforeEach(() => {
      createWrapper({ path: "/?redirect=/apps" });
    });

    it("redirects user to the given page", async () => {
      await waitFor(() => {
        expect(global.NavigateMock).toHaveBeenCalledWith("/apps");
      });
    });
  });

  describe("when user is logged in and redirect is not provided", () => {
    beforeEach(() => {
      createWrapper();
    });

    it("redirects user to the home page", async () => {
      await waitFor(() => {
        expect(global.NavigateMock).toHaveBeenCalledWith("/");
      });
    });
  });

  describe("when user is not logged in", () => {
    let loginOauthSpy;

    beforeEach(() => {
      scope = mockFetchAuthProviders({
        response: { gitlab: true, bitbucket: true, github: true },
      });

      loginOauthSpy = vi.fn();

      createWrapper({
        context: { user: undefined, loginOauth: loginOauthSpy },
      });
    });

    it("displays some text", async () => {
      await waitFor(() => {
        expect(wrapper.getByText(/SSL/)).toBeTruthy();
        expect(wrapper.getByText(/automated SSL/)).toBeTruthy();
        expect(wrapper.getByText(/Serverless functions/)).toBeTruthy();
      });
    });

    it("displays three buttons", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("GitHub")).toBeTruthy();
        expect(wrapper.getByText("Bitbucket")).toBeTruthy();
        expect(wrapper.getByText("GitLab")).toBeTruthy();
      });

      expect(scope.isDone()).toBe(true);
    });
  });

  describe("when user is not logged in and some providers are not configured", () => {
    beforeEach(() => {
      scope = mockFetchAuthProviders({
        response: { gitlab: true, bitbucket: false, github: false },
      });

      createWrapper({ context: { user: undefined, loginOauth: vi.fn() } });
    });

    it("displays one button", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("GitLab")).toBeTruthy();
      });

      expect(() => wrapper.getByText("GitHub")).toThrow();
      expect(() => wrapper.getByText("Bitbucket")).toThrow();

      expect(scope.isDone()).toBe(true);
    });
  });

  describe("when there is a login error", () => {
    beforeEach(() => {
      createWrapper({
        context: {
          user: undefined,
          authError: "Something went wrong while logging in.",
        },
      });
    });

    it("displays an infobox with the authError", async () => {
      await waitFor(() => {
        expect(
          wrapper.getByText("Something went wrong while logging in.")
        ).toBeTruthy();
      });
    });
  });
});
