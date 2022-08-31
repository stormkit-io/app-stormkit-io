import router from "react-router";
import { waitFor, fireEvent, getByText } from "@testing-library/react";
import { withMockContext } from "~/testing/helpers";
import * as data from "~/testing/data";
import * as nocks from "~/testing/nocks";

const fileName =
  "pages/apps/[id]/settings/_components/FormOutboundWebhookModal";

describe(fileName, () => {
  const path = `~/${fileName}`;
  let app;
  let wrapper;
  let historySpy;
  let toggleModalSpy;

  describe("create", () => {
    beforeEach(() => {
      app = data.mockApp();

      historySpy = jest.fn();
      toggleModalSpy = jest.fn();

      jest.spyOn(router, "useHistory").mockReturnValue({
        replace: historySpy,
      });

      wrapper = withMockContext(path, {
        app,
        toggleModal: toggleModalSpy,
      });
    });

    test.skip("displays a simple form initially", () => {
      expect(
        wrapper.getByRole("heading", { name: "Create outbound webhook" })
      ).toBeTruthy();

      expect(wrapper.getByLabelText("Request URL")).toBeTruthy();
      expect(wrapper.getByLabelText("Enable request headers")).toBeTruthy();
      expect(() => wrapper.getByLabelText(/Request headers/)).toThrow();
      expect(() => wrapper.getByLabelText(/Request payload/)).toThrow();
      expect(wrapper.getByLabelText(/Request method/)).toBeTruthy();
      expect(wrapper.getByLabelText(/Trigger\sthis\swebhook/)).toBeTruthy();
    });

    test.skip("displays request headers when enabled", async () => {
      fireEvent.click(wrapper.getByLabelText("Enable request headers"));

      await waitFor(() => {
        expect(wrapper.getByLabelText(/Header name/)).toBeTruthy();
        expect(wrapper.getByLabelText(/Header value/)).toBeTruthy();
      });
    });

    test.skip("displays request payload when request method is POST", () => {
      fireEvent.mouseDown(wrapper.getByLabelText(/Request method/));
      expect(getByText(document.body, "Post")).toBeTruthy();
      fireEvent.click(getByText(document.body, "Post"));
      expect(wrapper.getByLabelText(/Request payload/)).toBeTruthy();
    });

    test.skip("submits the form request", async () => {
      const scope = nocks.mockCreateOutboundWebhooks({
        app,
        hook: {
          requestUrl: "",
          requestMethod: "GET",
          requestHeaders: {},
          triggerWhen: "on_deploy",
        },
      });

      fireEvent.click(
        wrapper.getByRole("button", { name: "Create outbound webhook" })
      );

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
        expect(toggleModalSpy).toHaveBeenCalledWith(false);
        expect(historySpy).toHaveBeenCalledWith({
          state: { outboundWebhooksRefresh: expect.any(Number) },
        });
      });
    });
  });

  describe("update", () => {
    beforeEach(() => {
      app = data.mockApp();

      historySpy = jest.fn();
      toggleModalSpy = jest.fn();

      jest.spyOn(router, "useHistory").mockReturnValue({
        replace: historySpy,
      });

      wrapper = withMockContext(path, {
        app,
        toggleModal: toggleModalSpy,
        webhook: {
          id: "1",
          requestHeaders: { "Content-Type": "application/json", Auth: "Token" },
          requestMethod: "POST",
          requestUrl: "https://www.stormkit.io",
          triggerWhen: "on_publish",
        },
      });
    });

    test.skip("displays a pre-filled form", () => {
      expect(
        wrapper.getByRole("heading", { name: "Update outbound webhook" })
      ).toBeTruthy();

      expect(wrapper.getByLabelText("Request URL").value).toBe(
        "https://www.stormkit.io"
      );

      expect(wrapper.getAllByLabelText(/Header name/)[0].value).toBe(
        "Content-Type"
      );

      expect(wrapper.getAllByLabelText(/Header value/)[0].value).toBe(
        "application/json"
      );

      expect(wrapper.getAllByLabelText(/Header name/)[1].value).toBe("Auth");

      expect(wrapper.getAllByLabelText(/Header value/)[1].value).toBe("Token");

      expect(getByText(document.body, "Post")).toBeTruthy();
      expect(wrapper.getByLabelText(/Request payload/).value).toBe("");
      expect(wrapper.getByLabelText(/Trigger\sthis\swebhook/)).toBeTruthy();
      expect(
        getByText(document.body, "After deployment is published")
      ).toBeTruthy();
    });

    test.skip("submits the form request", async () => {
      const scope = nocks.mockUpdateOutboundWebhooks({
        app,
        whId: "1",
        hook: {
          requestUrl: "https://www.stormkit.io",
          requestMethod: "POST",
          requestPayload: "",
          requestHeaders: {
            "Content-Type": "application/json",
            Auth: "Token",
          },
          triggerWhen: "on_publish",
        },
      });

      expect(wrapper.getByLabelText("Request URL").value).toBe(
        "https://www.stormkit.io"
      );

      fireEvent.click(
        wrapper.getByRole("button", { name: "Update outbound webhook" })
      );

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
        expect(toggleModalSpy).toHaveBeenCalledWith(false);
        expect(historySpy).toHaveBeenCalledWith({
          state: { outboundWebhooksRefresh: expect.any(Number) },
        });
      });
    });
  });
});
