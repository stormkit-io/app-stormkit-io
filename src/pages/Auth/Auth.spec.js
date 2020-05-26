import { renderWithContext } from "~/testing/helpers";
import Auth from "./Auth";

describe("pages/Auth", () => {
  let wrapper;

  describe("when user is logged in and redirect is provided", () => {
    beforeEach(() => {
      wrapper = renderWithContext(Auth, {
        props: {
          location: { search: "?redirect=/user/home" },
        },
        context: {
          user: { id: "123" },
          loginOauth: jest.fn(),
        },
      });
    });

    test("redirects user to the home page", async () => {
      expect(wrapper.getByTestId("location-display-path").innerHTML).toBe(
        "/user/home"
      );
    });
  });

  describe("when user is logged in and redirect is not provided", () => {
    beforeEach(() => {
      wrapper = renderWithContext(Auth, {
        props: { location: { search: "" } },
        context: {
          user: { id: "123" },
          loginOauth: jest.fn(),
        },
      });
    });

    test("redirects user to the home page", async () => {
      expect(wrapper.getByTestId("location-display-path").innerHTML).toBe("/");
    });
  });

  describe("when user is not logged in", () => {
    beforeEach(() => {
      wrapper = renderWithContext(Auth, {
        context: {
          loginOauth: jest.fn(),
        },
      });
    });

    test("displays some text", () => {
      expect(wrapper.getByText(/SSL/)).toBeTruthy();
      expect(wrapper.getByText(/Serverless CI Platform/)).toBeTruthy();
      expect(wrapper.getByText(/dev-ops/)).toBeTruthy();
    });

    test("displays three buttons", () => {
      expect(wrapper.getByText("GitHub")).toBeTruthy();
      expect(wrapper.getByText("Bitbucket")).toBeTruthy();
      expect(wrapper.getByText("GitLab")).toBeTruthy();
    });
  });
});
