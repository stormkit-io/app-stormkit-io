import { waitFor, act } from "@testing-library/react";
import { withAppContext } from "~/testing/helpers";
import * as data from "~/testing/data";
import * as nocks from "~/testing/nocks";

describe("pages/app", () => {
  let wrapper;

  describe("when an app is found", () => {
    beforeEach(() => {
      const app = data.mockAppResponse();
      const envs = data.mockEnvironmentsResponse();
      nocks.mockAppProxy({ app, envs: envs.envs });

      act(() => {
        wrapper = withAppContext({
          app,
          envs: envs,
          path: "/apps/1"
        });
      });
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
      wrapper = withAppContext({
        app: {},
        envs: data.mockEnvironmentsResponse(),
        path: "/apps/100"
      });
    });

    test("should not display the menu or header", async () => {
      await waitFor(() => {
        expect(() => wrapper.getByText("Environments")).toThrow();
        expect(() => wrapper.getByText("Deployments")).toThrow();
      });
    });
  });
});
