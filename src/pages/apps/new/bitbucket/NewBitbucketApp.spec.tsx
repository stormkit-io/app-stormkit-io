import type { RenderResult } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router";
import { render, waitFor } from "@testing-library/react";
import bitbucketApi from "~/utils/api/Bitbucket";
import * as nocks from "~/testing/nocks/nock_bitbucket";
import NewBitbucketApp from "./NewBitbucketApp";

const { mockFetchRepositories } = nocks;

describe("~/pages/apps/new/github/NewBitbucketApp.tsx", () => {
  let wrapper: RenderResult;

  const createWrapper = () => {
    const memoryRouter = createMemoryRouter([
      { path: "*", element: <NewBitbucketApp /> },
    ]);

    wrapper = render(<RouterProvider router={memoryRouter} />);
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
      expect(wrapper.getByText("Import from Bitbucket")).toBeTruthy();
    });

    test("should render repositories", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("jdoe/simple-project")).toBeTruthy();
      });
    });
  });
});
