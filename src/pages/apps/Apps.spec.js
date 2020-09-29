import { waitFor } from "@testing-library/react";
import nock from "nock";
import { withUserContext } from "~/testing/helpers";

describe("pages/apps", () => {
  let wrapper;

  const apps = [
    { id: "12315151", displayName: "My-App" },
    { id: "3125151", displayName: "My-Second-App" }
  ];

  describe("when user has already created apps", () => {
    beforeEach(() => {
      nock("http://localhost")
        .get("/apps")
        .reply(200, { apps });

      wrapper = withUserContext({ path: "/" });
    });

    test("should fetch the list of apps", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("My-App")).toBeTruthy();
      });
    });

    test("should have a button to create a new app", async () => {
      await waitFor(() => {
        expect(wrapper.getAllByText("New App")[1]).toBeTruthy();
      });
    });
  });

  describe("when the user has just created an app", () => {
    beforeEach(() => {
      wrapper = withUserContext({ path: "/" });
      wrapper.history.replace({ state: { repoInsert: true } });
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
