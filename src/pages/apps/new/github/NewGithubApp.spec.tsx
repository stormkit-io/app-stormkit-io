import type { MemoryHistory } from "history";
import type { RenderResult } from "@testing-library/react";
import React from "react";
import { Router } from "react-router";
import { createMemoryHistory } from "history";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { AuthContext } from "~/pages/auth/Auth.context";
import githubApi from "~/utils/api/Github";
import * as nocks from "~/testing/nocks/nock_github";
import { mockUser } from "~/testing/data";
import NewGithubApp from "./NewGithubApp";

const { mockFetchInstallations, mockFetchRepositories } = nocks;

describe("~/pages/apps/new/github/NewGithubApp.tsx", () => {
  let wrapper: RenderResult;
  let history: MemoryHistory;
  let user: User;

  const createWrapper = () => {
    user = mockUser();
    history = createMemoryHistory();
    wrapper = render(
      <Router location={history.location} navigator={history}>
        <AuthContext.Provider value={{ user }}>
          <NewGithubApp />
        </AuthContext.Provider>
      </Router>
    );
  };

  describe("fetching data", () => {
    const installationId = "5818";
    const installationId2 = "5911";
    const originalBaseUrl = githubApi.baseurl;

    beforeEach(() => {
      githubApi.accessToken = "123456";
      githubApi.baseurl = "http://localhost";

      mockFetchInstallations({
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

      mockFetchRepositories({
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
    });

    afterEach(() => {
      githubApi.accessToken = "";
      githubApi.baseurl = originalBaseUrl;
    });

    test("should have a proper title", () => {
      expect(wrapper.getByText("Import app from GitHub")).toBeTruthy();
    });

    test("should render repositories", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("simple-project")).toBeTruthy();
      });
    });

    test("chooses jdoe as the selected account", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("jdoe")).toBeTruthy();
      });
    });

    test("selecting a different account should trigger a refetch", async () => {
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

      const input = wrapper.getAllByRole("button").at(1);
      expect(input).toBeTruthy();
      fireEvent.mouseDown(input!);

      await waitFor(() => {
        expect(wrapper.getByText("jane")).toBeTruthy();
      });

      fireEvent.click(wrapper.getByText("jane"));

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
        expect(wrapper.getByText("sample-project")).toBeTruthy();
      });
    });

    test("clicking connect more should open a popup so that the user can configure permissions", () => {
      const account =
        process.env.STORMKIT_ENV === "production"
          ? "stormkit-io"
          : "stormkit-io-dev";

      window.open = jest.fn();
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
