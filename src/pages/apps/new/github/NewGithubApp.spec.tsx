import type { RenderResult } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { fireEvent, waitFor, screen } from "@testing-library/react";
import { AuthContext } from "~/pages/auth/Auth.context";
import githubApi from "~/utils/api/Github";
import * as nocks from "~/testing/nocks/nock_github";
import { mockFetchInstanceDetails } from "~/testing/nocks/nock_user";
import { mockUser } from "~/testing/data";
import NewGithubApp from "./NewGithubApp";
import { renderWithRouter } from "~/testing/helpers";

const { mockFetchInstallations, mockFetchRepositories } = nocks;

interface Props {
  github?: string;
}

describe("~/pages/apps/new/github/NewGithubApp.tsx", () => {
  let wrapper: RenderResult;
  let user: User;

  const findOption = (text: string) => screen.getByText(text);

  const createWrapper = async (props?: Props) => {
    const scope = mockFetchInstanceDetails({
      response: {
        update: { api: false },
        auth: { github: props?.github || "stormkit-dev" },
      },
    });

    user = mockUser();
    wrapper = renderWithRouter({
      el: () => (
        <AuthContext.Provider value={{ user }}>
          <NewGithubApp />
        </AuthContext.Provider>
      ),
    });

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
    });
  };

  describe("github account with environment variable", () => {
    const account = "my-stormkit-app";

    beforeEach(async () => {
      githubApi.accessToken = "123456";
      githubApi.baseurl = process.env.API_DOMAIN || "";

      mockFetchInstallations({
        response: {
          total_count: 0,
          installations: [],
        },
      });

      await createWrapper({ github: account });
    });

    it("clicking connect more should open a popup so that the user can configure permissions", () => {
      window.open = vi.fn();
      const button = wrapper.getByText("Connect more repositories");
      fireEvent.click(button);
      expect(window.open).toHaveBeenCalledWith(
        `https://github.com/apps/${account}/installations/new`,
        "Add repository",
        "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1000,height=600,left=100,top=100"
      );
    });
  });

  describe("empty data", () => {
    beforeEach(() => {
      githubApi.accessToken = "123456";
      githubApi.baseurl = process.env.API_DOMAIN || "";

      mockFetchInstallations({
        response: {
          total_count: 0,
          installations: [],
        },
      });

      createWrapper();
    });

    it("no connected accounts should display a warning", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("No connected accounts found")).toBeTruthy();
      });
    });
  });

  describe("fetching data", () => {
    const installationId = "5818";
    const installationId2 = "5911";
    const originalBaseUrl = githubApi.baseurl;

    beforeEach(async () => {
      githubApi.accessToken = "123456";
      githubApi.baseurl = process.env.API_DOMAIN || "";

      const scope1 = mockFetchInstallations({
        response: {
          total_count: 10,
          installations: [
            {
              id: installationId,
              account: {
                login: "jdoe",
                avatar_url: "https://example.com/jdoe",
              },
            },
            {
              id: installationId2,
              account: {
                login: "jane",
                avatar_url: "https://example.com/jane",
              },
            },
          ],
        },
      });

      const scope2 = mockFetchRepositories({
        installationId,
        query: {
          page: 1,
          per_page: 25,
        },
        response: {
          total_count: 10,
          repositories: [
            {
              name: "simple-project",
              full_name: "jdoe/simple-project",
            },
          ],
        },
      });

      createWrapper();

      await waitFor(() => {
        expect(scope1.isDone()).toBe(true);
        expect(scope2.isDone()).toBe(true);
      });
    });

    afterEach(() => {
      githubApi.accessToken = "";
      githubApi.baseurl = originalBaseUrl;
    });

    it("should have a proper title", () => {
      expect(wrapper.getByText("Import from GitHub")).toBeTruthy();
    });

    it("should render repositories", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("simple-project")).toBeTruthy();
      });
    });

    it("chooses jdoe as the selected account", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("jdoe")).toBeTruthy();
      });
    });

    it("selecting a different account should trigger a refetch", async () => {
      const scope = mockFetchRepositories({
        installationId: installationId2,
        query: {
          page: 1,
          per_page: 25,
        },
        response: {
          total_count: 1,
          repositories: [
            {
              name: "sample-project",
              full_name: "jane/sample-project",
            },
          ],
        },
      });

      await waitFor(() => {
        expect(wrapper.getByText("simple-project")).toBeTruthy();
      });

      const input = wrapper.getByRole("combobox");

      await waitFor(() => {
        expect(findOption("jdoe")).toBeTruthy();
      });

      expect(input).toBeTruthy();
      fireEvent.mouseDown(input);

      await waitFor(() => {
        expect(findOption("jane")).toBeTruthy();
      });

      fireEvent.click(wrapper.getByText("jane"));

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
        expect(wrapper.getByText("sample-project")).toBeTruthy();
      });
    });

    it("clicking connect more should open a popup so that the user can configure permissions", () => {
      const account = "stormkit-dev";

      window.open = vi.fn();
      const button = wrapper.getByText("Connect more repositories");
      fireEvent.click(button);
      expect(window.open).toHaveBeenCalledWith(
        `https://github.com/apps/${account}/installations/new`,
        "Add repository",
        "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1000,height=600,left=100,top=100"
      );
    });
  });
});
