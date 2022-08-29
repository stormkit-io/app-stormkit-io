import router from "react-router";
import { withMockContext } from "~/testing/helpers";
import { waitFor } from "@testing-library/react";

const fileName = "pages/auth";

describe(fileName, () => {
  const path = `~/${fileName}`;
  let wrapper;

  describe("when user is logged in and redirect is provided", () => {
    beforeEach(() => {
      jest.spyOn(router, "useLocation").mockReturnValue({
        search: "?redirect=/apps",
      });

      wrapper = withMockContext(path, { user: { id: 1 } });
    });

    test("redirects user to the given page", async () => {
      await waitFor(() => {
        expect(wrapper.history.location.pathname).toBe("/apps");
      });
    });
  });

  describe("when user is logged in and redirect is not provided", () => {
    beforeEach(() => {
      jest.spyOn(router, "useLocation").mockReturnValue({
        search: "",
      });

      wrapper = withMockContext(path, { user: { id: 1 } });
    });

    test("redirects user to the home page", async () => {
      await waitFor(() => {
        expect(wrapper.history.location.pathname).toBe("/");
      });
    });
  });

  describe("when user is not logged in", () => {
    let loginOauthSpy;

    beforeEach(() => {
      loginOauthSpy = jest.fn();

      jest.spyOn(router, "useLocation").mockReturnValue({
        search: "",
      });

      wrapper = withMockContext(path, {
        user: undefined,
        loginOauth: loginOauthSpy,
      });
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
});
