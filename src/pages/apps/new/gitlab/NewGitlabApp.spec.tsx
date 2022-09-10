import type { MemoryHistory } from "history";
import type { RenderResult } from "@testing-library/react";
import React from "react";
import { Router } from "react-router";
import { createMemoryHistory } from "history";
import { render, waitFor } from "@testing-library/react";
import gitlabApi from "~/utils/api/Gitlab";
import * as nocks from "~/testing/nocks/nock_gitlab";
import NewGitlabApp from "./NewGitlabApp";

const { mockFetchRepositories } = nocks;

describe("~/pages/apps/new/github/NewGitlabApp.tsx", () => {
  let wrapper: RenderResult;
  let history: MemoryHistory;

  const createWrapper = () => {
    history = createMemoryHistory();
    wrapper = render(
      <Router location={history.location} navigator={history}>
        <NewGitlabApp />
      </Router>
    );
  };

  describe("fetching data", () => {
    const originalBaseUrl = gitlabApi.baseurl;

    beforeEach(() => {
      gitlabApi.accessToken = "123456";
      gitlabApi.baseurl = "http://localhost";

      mockFetchRepositories({
        query: {
          page: 1,
          per_page: 20,
        },
        response: [
          {
            name: "simple-project",
            path_with_namespace: "jdoe/simple-project",
          },
        ],
      });

      createWrapper();
    });

    afterEach(() => {
      gitlabApi.accessToken = "";
      gitlabApi.baseurl = originalBaseUrl;
    });

    test("should have a proper title", () => {
      expect(wrapper.getByText("Import app from GitLab")).toBeTruthy();
    });

    test("should render repositories", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("jdoe/simple-project")).toBeTruthy();
      });
    });
  });
});
