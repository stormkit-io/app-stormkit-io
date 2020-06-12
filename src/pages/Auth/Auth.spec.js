import { renderWithContext, withUserContext } from "~/testing/helpers";
import { waitFor } from "@testing-library/react";

describe("pages/Auth", () => {
  let wrapper;

  describe("when user is logged in and redirect is provided", () => {
    beforeEach(() => {
      wrapper = withUserContext({
        path: "/auth?redirect=/apps",
      });
    });

    test("redirects user to the given page", async () => {
      await waitFor(() => {
        expect(wrapper.history.location.pathname).toBe("/apps");
      });
    });
  });

  describe("when user is logged in and redirect is not provided", () => {
    beforeEach(() => {
      wrapper = withUserContext({
        path: "/auth",
      });
    });

    test("redirects user to the home page", async () => {
      await waitFor(() => {
        expect(wrapper.history.location.pathname).toBe("/");
      });
    });
  });

  describe("when user is not logged in", () => {
    beforeEach(() => {
      wrapper = renderWithContext({});
    });

    test("displays some text", async () => {
      await waitFor(() => {
        expect(wrapper.getByText(/SSL/)).toBeTruthy();
        expect(wrapper.getByText(/Serverless CI Platform/)).toBeTruthy();
        expect(wrapper.getByText(/dev-ops/)).toBeTruthy();
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
});
