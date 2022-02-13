import router from "react-router";
import { fireEvent, waitFor } from "@testing-library/react";
import { withMockContext, waitForPromises } from "~/testing/helpers";
import { mockApp } from "~/testing/data";
import { mockFetchApps } from "~/testing/nocks";

const fileName = "pages/apps";

describe(fileName, () => {
  let wrapper;

  const apps = [mockApp(), mockApp()];

  apps[0].id = "1231231";
  apps[1].id = "5121231";
  apps[0].displayName = "My-app";
  apps[1].displayName = "My-second-app";

  describe("when user has already created apps", () => {
    beforeEach(() => {
      mockFetchApps({ response: { apps, hasNextPage: false } });
      wrapper = withMockContext({ path: `~/${fileName}` });
    });

    test("should fetch the list of apps", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("My-app")).toBeTruthy();
        expect(wrapper.getByText("My-second-app")).toBeTruthy();
      });
    });

    test("should have a button to create a new app", async () => {
      await waitFor(() => {
        expect(wrapper.getAllByText("New App")[1]).toBeTruthy();
      });
    });

    test("should not have a button to load more", async () => {
      await waitForPromises();
      expect(() => wrapper.getByText("Load more")).toThrow();
    });
  });

  describe("when user has more apps to load", () => {
    beforeEach(() => {
      mockFetchApps({ response: { apps, hasNextPage: true } });
      wrapper = withMockContext({ path: `~/${fileName}` });
    });

    test("should have a button to load more", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("Load more")).toBeTruthy();
      });
    });

    test("should trigger a new call when the button is clicked", async () => {
      const newApps = [{...apps[0], id: '7481841'}];

      const scope = mockFetchApps({
        from: 20,
        response: { apps: newApps, hasNextPage: false },
      });

      let button;

      await waitFor(() => {
        button = wrapper.getByText("Load more");
      });

      fireEvent.click(button);

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
      });
    });
  });

  describe("when the user has just created an app", () => {
    beforeEach(() => {
      jest.spyOn(router, "useLocation").mockReturnValue({
        state: { repoInsert: true },
      });

      mockFetchApps({ response: { apps, hasNextPage: false } });
      wrapper = withMockContext({ path: `~/${fileName}` });
    });

    test("should display a success message", async () => {
      await waitFor(() => {
        expect(
          wrapper.getByText(
            "Great, your app has been created! You can now start deploying."
          )
        ).toBeTruthy();
      });
    });
  });
});
