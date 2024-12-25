import type { RenderResult } from "@testing-library/react";
import type { Scope } from "nock";
import { describe, expect, beforeEach, it, vi } from "vitest";
import { waitFor } from "@testing-library/react";
import { AuthContext } from "~/pages/auth/Auth.context";
import { AppContext } from "~/pages/apps/[id]/App.context";
import mockApp from "~/testing/data/mock_app";
import mockUser from "~/testing/data/mock_user";
import { mockFetchUsage } from "~/testing/nocks";
import { renderWithRouter } from "~/testing/helpers";
import Usage from "./Usage";

interface Props {
  app: App;
  user: User;
}

describe("~/pages/apps/[id]/usage/Usage", () => {
  let wrapper: RenderResult;
  let currentApp: App;
  let currentUser: User;

  const createWrapper = ({ app, user }: Props) => {
    wrapper = renderWithRouter({
      el: () => (
        <AuthContext.Provider value={{ user }}>
          <AppContext.Provider
            value={{ app, setRefreshToken: vi.fn(), environments: [] }}
          >
            <Usage />
          </AppContext.Provider>
        </AuthContext.Provider>
      ),
    });
  };

  describe("enterprise users", () => {
    let scope: Scope;

    beforeEach(() => {
      currentApp = mockApp();
      currentUser = mockUser();

      scope = mockFetchUsage({
        appId: currentApp.id,
        response: {
          numberOfDeploymentsThisMonth: 3,
          remainingDeploymentsThisMonth: 12,
        },
      });

      createWrapper({ app: currentApp, user: currentUser });
    });

    it("should display a spinner", () => {
      expect(wrapper.container.innerHTML).toContain("MuiLinearProgress");
    });

    it("should list number of deployments", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("Number of Deployments")).toBeTruthy();
        expect(wrapper.getByText(/3\s\/\s15/)).toBeTruthy();
      });
    });

    it("should not show an upgrade account for enterprise users", async () => {
      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
        expect(() => wrapper.getByText(/Upgrade account/)).toThrow();
      });
    });
  });

  describe("non-enterprise users", () => {
    beforeEach(() => {
      currentApp = mockApp();
      currentUser = mockUser();
      currentUser.package.id = "free";

      mockFetchUsage({
        appId: currentApp.id,
        response: {
          numberOfDeploymentsThisMonth: 3,
          remainingDeploymentsThisMonth: 12,
        },
      });

      createWrapper({ app: currentApp, user: currentUser });
    });

    it("should show an upgrade account for non-enterprise users", async () => {
      await waitFor(() => {
        expect(wrapper.getByText(/Upgrade account/).getAttribute("href")).toBe(
          "/user/account"
        );
      });
    });
  });

  describe("api error", () => {
    beforeEach(() => {
      currentApp = mockApp();
      currentUser = mockUser();

      mockFetchUsage({
        appId: currentApp.id,
        status: 401,
      });

      createWrapper({ app: currentApp, user: currentUser });
    });

    it("should show an error message", async () => {
      await waitFor(() => {
        expect(
          wrapper.getByText("Something went wrong while fetching usage data.")
        ).toBeTruthy();
      });
    });
  });
});
