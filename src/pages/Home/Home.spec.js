import { wait } from "@testing-library/react";
import { renderWithContext } from "~/testing/helpers";
import Home from "./Home";

describe("pages/Home", () => {
  let wrapper;

  const apps = [
    { id: "12315151", displayName: "My-App" },
    { id: "3125151", displayName: "My-Second-App" },
  ];

  describe("when user has already created apps", () => {
    let fetchSpy;

    beforeEach(() => {
      fetchSpy = jest.fn().mockImplementation(() => Promise.resolve({ apps }));
      wrapper = renderWithContext(Home, {
        context: {
          api: {
            fetch: fetchSpy,
          },
        },
      });
    });

    test("should fetch the list of apps", async () => {
      expect(fetchSpy).toHaveBeenCalledWith("/apps");

      await wait(() => {
        expect(wrapper.getByText("My-App")).toBeTruthy();
      });
    });

    test("should have a button to create a new app", () => {
      const button = wrapper.getByText("New App");
      expect(button).toBeTruthy();
    });
  });
});
