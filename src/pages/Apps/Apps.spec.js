import { waitFor } from "@testing-library/react";
import { renderWithContext } from "~/testing/helpers";
import Apps from "./Apps";

describe("pages/Apps", () => {
  let wrapper;

  const apps = [
    { id: "12315151", displayName: "My-App" },
    { id: "3125151", displayName: "My-Second-App" },
  ];

  describe("when user has already created apps", () => {
    let fetchSpy;

    beforeEach(() => {
      fetchSpy = jest.fn().mockImplementation(() => Promise.resolve({ apps }));
      wrapper = renderWithContext(Apps, {
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
});
