import router from "react-router";
import { fireEvent, waitFor } from "@testing-library/react";
import { withMockContext, waitForPromises } from "~/testing/helpers";
import { mockApp, mockUserResponse } from "~/testing/data";
import { mockFetchUsage } from "~/testing/nocks";

const fileName = "pages/apps/[id]/usage/Usage";

describe(fileName, () => {
  let wrapper;
  let app;
  let user;

  describe("api success", () => {
    beforeEach(() => {
      app = mockApp();
      user = mockUserResponse().user;
      mockFetchUsage({ app });
      wrapper = withMockContext({
        path: `~/${fileName}`,
        props: {
          app,
          user,
        },
      });
    });

    test.skip("should display a spinner", () => {
      expect(wrapper.container).toMatchSnapshot();
    });

    test.skip("should list number of deployments", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("Number of Deployments")).toBeTruthy();
        expect(wrapper.getByText(/3\s\/\s15/)).toBeTruthy();
      });
    });

    test.skip("should show upgrade account for non-enterprise users", async () => {
      await waitFor(() => {
        expect(wrapper.getByText(/Upgrade account/)).toBeTruthy();
      });
    });
  });

  describe("api error", () => {
    beforeEach(() => {
      app = mockApp();
      user = mockUserResponse().user;
      mockFetchUsage({ app, status: 401 });
      wrapper = withMockContext({
        path: `~/${fileName}`,
        props: {
          app,
          user,
        },
      });
    });

    test.skip("should show an error message", async () => {
      await waitFor(() => {
        expect(
          wrapper.getByText("Something went wrong while fetching usage data.")
        ).toBeTruthy();
      });
    });
  });

  describe("enterprise users", () => {
    beforeEach(() => {
      app = mockApp();
      user = mockUserResponse().user;
      user.package.id = "enterprise";
      mockFetchUsage({ app });
      wrapper = withMockContext({
        path: `~/${fileName}`,
        props: {
          app,
          user,
        },
      });
    });

    test.skip("should show upgrade account for non-enterprise users", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("Number of Deployments")).toBeTruthy();
        expect(() => wrapper.getByText(/Upgrade account/)).toThrow();
      });
    });
  });
});
