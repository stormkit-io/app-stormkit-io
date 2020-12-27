import router from "react-router";
import { waitFor } from "@testing-library/react";
import { withMockContext } from "~/testing/helpers";
import * as data from "~/testing/data";
import * as nocks from "~/testing/nocks";

const fileName = "pages/apps/App.context";

describe.only(fileName, () => {
  const path = `~/${fileName}`;
  let wrapper;

  const createWrapper = ({ status = 200 }) => {
    const app = data.mockApp();
    const envs = data.mockEnvironments({ app });

    jest.spyOn(router, "useRouteMatch").mockReturnValue({
      params: { id: app.id }
    });

    jest.spyOn(router, "useLocation").mockReturnValue({
      state: {}
    });

    nocks.mockFetchApp({ app, status });
    nocks.mockFetchEnvironments({
      app,
      status,
      response: { hasNextPage: false, envs }
    });

    wrapper = withMockContext({ path, mockModal: false });
  };

  describe("when an app is found", () => {
    beforeEach(() => {
      createWrapper({ status: 200 });
    });

    test("should display the navigation on the left", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("Environments")).toBeTruthy();
        expect(wrapper.getByText("Deployments")).toBeTruthy();
        expect(wrapper.getByText("Team")).toBeTruthy();
        expect(wrapper.getByText("Settings")).toBeTruthy();
      });
    });

    test("should display the deploy now button on top right", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("Deploy now")).toBeTruthy();
      });
    });
  });

  describe("when an app is not found", () => {
    beforeEach(() => {
      createWrapper({ status: 404 });
    });

    test("should not display the menu or header", async () => {
      await waitFor(() => {
        expect(() => wrapper.getByText("Environments")).toThrow();
        expect(() => wrapper.getByText("Deployments")).toThrow();
        expect(() => wrapper.getByText("Deploy now")).toThrow();
      });
    });

    test("should display a 4 oh 4 message", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("4 oh 4")).toBeTruthy();
      });
    });
  });
});
