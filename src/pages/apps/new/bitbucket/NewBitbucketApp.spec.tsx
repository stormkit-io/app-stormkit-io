import type { MemoryHistory } from "history";
import type { RenderResult } from "@testing-library/react";
import React from "react";
import { Router } from "react-router";
import { createMemoryHistory } from "history";
import { render, waitFor } from "@testing-library/react";
import bitbucketApi from "~/utils/api/Bitbucket";
import * as nocks from "~/testing/nocks/nock_bitbucket";
import NewBitbucketApp from "./NewBitbucketApp";

const { mockFetchRepositories } = nocks;

describe("~/pages/apps/new/github/NewBitbucketApp.tsx", () => {
  let wrapper: RenderResult;
  let history: MemoryHistory;

  const createWrapper = () => {
    history = createMemoryHistory();
    wrapper = render(
      <Router location={history.location} navigator={history}>
        <NewBitbucketApp />
      </Router>
    );
  };

  describe("fetching data", () => {
    const originalBaseUrl = bitbucketApi.baseurl;

    beforeEach(() => {
      bitbucketApi.accessToken = "123456";
      bitbucketApi.baseurl = "http://localhost";

      mockFetchRepositories({
        query: {
          role: "admin",
          pagelen: 100,
        },
        response: {
          next: "",
          values: [
            {
              name: "simple-project",
              full_name: "jdoe/simple-project",
              type: "repository",
            },
          ],
        },
      });

      createWrapper();
    });

    afterEach(() => {
      bitbucketApi.accessToken = "";
      bitbucketApi.baseurl = originalBaseUrl;
    });

    test("should have a proper title", () => {
      expect(wrapper.getByText("Import app from Bitbucket")).toBeTruthy();
    });

    test("should render repositories", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("jdoe/simple-project")).toBeTruthy();
      });
    });
  });
});
