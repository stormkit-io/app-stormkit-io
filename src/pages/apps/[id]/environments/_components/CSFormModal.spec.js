import { waitFor, fireEvent, getByText } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { withMockContext } from "~/testing/helpers";
import * as data from "~/testing/data";
import * as nocks from "~/testing/nocks";

const fileName = "pages/apps/[id]/environments/_components/CSFormModal";

describe(fileName, () => {
  const path = `~/${fileName}`;
  let wrapper;
  let app;
  let env;

  const selectIntegration = name => {
    fireEvent.mouseDown(wrapper.getByLabelText(/Integration/));
    fireEvent.click(getByText(document.body, name));
  };

  describe("when user is not in paid tier", () => {
    beforeEach(() => {
      app = data.mockApp();
      env = data.mockEnvironments({ app })[0];
      wrapper = withMockContext(path, {
        app,
        environment: env,
        toggleModal: jest.fn(),
        user: {
          package: {
            customStorage: false,
          },
        },
        history: {
          replace: jest.fn(),
        },
      });
    });

    test("should display a warning", async () => {
      expect(
        wrapper.getByTestId("paid-tier").closest("div").innerHTML
      ).toContain("This is a paid feature. Please");
    });

    test("should not allow submitting the form", async () => {
      selectIntegration("Bunny CDN");

      const externalUrl = wrapper.getByLabelText("External URL");
      const storageZone = wrapper.getByLabelText("Storage zone");
      const storageKey = wrapper.getByLabelText("Storage key");

      userEvent.type(externalUrl, "https://www.stormkit.ko");
      userEvent.type(storageKey, "asdf-123");
      userEvent.type(storageZone, "test-zone");

      expect(
        wrapper.getByText("Submit").closest("button").getAttribute("disabled")
      ).toBe("");
    });
  });

  describe("bunny cdn", () => {
    beforeEach(() => {
      app = data.mockApp();
      env = data.mockEnvironments({ app })[0];
      wrapper = withMockContext(path, {
        app,
        environment: env,
        toggleModal: jest.fn(),
        user: {
          package: {
            customStorage: true,
          },
        },
        history: {
          replace: jest.fn(),
        },
      });
    });

    test("should submit the form properly", async () => {
      const config = {
        integration: "bunny_cdn",
        externalUrl: "https://yoyo.b-cdn.net",
        settings: {
          STORAGE_KEY: "123-abc",
          STORAGE_ZONE: "stormkit-react",
        },
      };

      const scope = nocks.mockCustomStorage({
        appId: app.id,
        envId: env.id,
        config,
      });

      selectIntegration("Bunny CDN");

      const externalUrl = wrapper.getByLabelText("External URL");
      const storageZone = wrapper.getByLabelText("Storage zone");
      const storageKey = wrapper.getByLabelText("Storage key");

      userEvent.type(externalUrl, config.externalUrl);
      userEvent.type(storageKey, config.settings.STORAGE_KEY);
      userEvent.type(storageZone, config.settings.STORAGE_ZONE);

      expect(
        wrapper.getByText("Submit").closest("button").getAttribute("disabled")
      ).toBe(null);

      fireEvent.click(wrapper.getByText("Submit"));

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
        expect(wrapper.injectedProps.toggleModal).toHaveBeenCalledWith(false);
        expect(wrapper.spies.history.replace).toHaveBeenCalledWith({
          state: {
            envs: expect.any(Number),
            message: "Custom integration has been updated successfully.",
          },
        });
      });
    });
  });
});
