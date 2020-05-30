import { waitFor } from "@testing-library/react";
import { renderWithContext } from "~/testing/helpers";
import Apps from "./Apps";

describe("pages/Apps", () => {
  let wrapper;
  let fetchSpy;

  const apps = [
    { id: "12315151", displayName: "My-App" },
    { id: "3125151", displayName: "My-Second-App" },
  ];

  describe("when user has already created apps", () => {
    beforeEach(() => {
      fetchSpy = jest.fn().mockImplementation(() => Promise.resolve({ apps }));
      wrapper = renderWithContext(Apps, {
        props: {
          location: {},
        },
        context: {
          api: {
            fetch: fetchSpy,
          },
        },
      });
    });

    test("should fetch the list of apps", async () => {
      expect(fetchSpy).toHaveBeenCalledWith("/apps");

      await waitFor(() => {
        expect(wrapper.getByText("My-App")).toBeTruthy();
      });
    });

    test("should have a button to create a new app", () => {
      const button = wrapper.getAllByText("New App")[1];
      expect(button).toBeTruthy();
    });
  });

  describe("when the user has just created an app", () => {
    beforeEach(() => {
      fetchSpy = jest.fn().mockImplementation(() => Promise.resolve({ apps }));
      wrapper = renderWithContext(Apps, {
        props: {
          location: {
            state: {
              repoInsert: true,
            },
          },
        },
        context: {
          api: {
            fetch: fetchSpy,
          },
        },
      });
    });

    test("should display a success message", () => {
      expect(
        wrapper.getByText(
          "Great, your app has been created! You can now start deploying."
        )
      ).toBeTruthy();
    });
  });
});
