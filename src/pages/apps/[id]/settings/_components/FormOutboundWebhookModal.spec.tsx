import { fireEvent, RenderResult } from "@testing-library/react";
import type { OutboundWebhook } from "../types";
import { waitFor, render } from "@testing-library/react";
import mockApp from "~/testing/data/mock_app";
import {
  mockCreateOutboundWebhook,
  mockUpdateOutboundWebhook,
} from "~/testing/nocks/nock_outbound_webhooks";
import FormOutboundWebhookModal from "./FormOutboundWebhookModal";
import mockOutboundWebhooks from "~/testing/data/mock_outbound_webhooks";

interface Props {
  app: App;
  webhook?: OutboundWebhook;
}

jest.mock("@codemirror/lang-json", () => ({ json: jest.fn() }));
jest.mock("@uiw/react-codemirror", () => ({ value }: { value: string }) => (
  <span data-testid="editor">{value}</span>
));

describe("~/pages/apps/[id]/settings/_components/FormOutboundWebhookModal", () => {
  let currentApp: App;
  let currentWH: OutboundWebhook;
  let wrapper: RenderResult;
  let onUpdate: jest.Mock;
  let toggleModal: jest.Mock;

  const createWrapper = ({ app, webhook }: Props) => {
    toggleModal = jest.fn();
    onUpdate = jest.fn();
    wrapper = render(
      <FormOutboundWebhookModal
        isOpen={true}
        webhook={webhook}
        app={app}
        toggleModal={toggleModal}
        onUpdate={onUpdate}
      />
    );
  };

  describe("create", () => {
    beforeEach(() => {
      currentApp = mockApp();
      createWrapper({ app: currentApp });
    });

    test("displays a simple form initially", () => {
      expect(
        wrapper.getByRole("heading", { name: "Create an outbound webhook" })
      ).toBeTruthy();

      expect(wrapper.getByLabelText("Request URL")).toBeTruthy();
      expect(wrapper.getByLabelText("Enable headers")).toBeTruthy();
      expect(() => wrapper.getByTestId("request-headers")).toThrow();
      expect(() => wrapper.getByLabelText(/Request payload/)).toThrow();
      expect(wrapper.getByLabelText(/Request method/)).toBeTruthy();
      expect(wrapper.getByLabelText(/Trigger when/)).toBeTruthy();
    });

    test("displays request headers when enabled", async () => {
      fireEvent.click(wrapper.getByLabelText("Enable headers"));

      await waitFor(() => {
        expect(wrapper.getByText(/Header name/)).toBeTruthy();
        expect(wrapper.getByText(/Header value/)).toBeTruthy();
      });
    });

    test("displays request payload when request method is POST", async () => {
      await fireEvent.mouseDown(wrapper.getByText("Get"));
      await fireEvent.click(wrapper.getByText("Post"));
      expect(wrapper.getByText(/Request payload/)).toBeTruthy();
    });

    test("submits the form request", async () => {
      const scope = mockCreateOutboundWebhook({
        appId: currentApp.id,
        hook: {
          requestUrl: "",
          requestMethod: "GET",
          requestHeaders: {},
          triggerWhen: "on_deploy_success",
        },
      });

      fireEvent.click(
        wrapper.getByRole("button", { name: "Create outbound webhook" })
      );

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
        expect(toggleModal).toHaveBeenCalledWith(false);
        expect(onUpdate).toHaveBeenCalled();
      });
    });
  });

  describe("update", () => {
    beforeEach(() => {
      currentApp = mockApp();
      currentWH = mockOutboundWebhooks()[0];
      createWrapper({ app: currentApp, webhook: currentWH });
    });

    test("displays a pre-filled form", () => {
      expect(
        wrapper.getByRole("heading", { name: "Update outbound webhook" })
      ).toBeTruthy();

      const requestUrl = wrapper.getByLabelText(
        "Request URL"
      ) as HTMLInputElement;

      expect(requestUrl.value).toBe(currentWH.requestUrl);

      expect(wrapper.getByDisplayValue("content-type")).toBeTruthy();
      expect(wrapper.getByDisplayValue("application/json")).toBeTruthy();

      expect(wrapper.getByText("Post")).toBeTruthy();
      expect(wrapper.getByTestId("editor").innerHTML).toBe('{"embeds":[]}');
      expect(wrapper.getByLabelText(/Trigger when/)).toBeTruthy();
      expect(wrapper.getByText("After deployment is published")).toBeTruthy();
    });

    test("submits the form request", async () => {
      const scope = mockUpdateOutboundWebhook({
        appId: currentApp.id,
        whId: currentWH.id!,
        hook: {
          requestUrl: currentWH.requestUrl,
          requestMethod: currentWH.requestMethod,
          requestPayload: currentWH.requestPayload,
          requestHeaders: currentWH.requestHeaders,
          triggerWhen: currentWH.triggerWhen,
        },
      });

      fireEvent.click(
        wrapper.getByRole("button", { name: "Update outbound webhook" })
      );

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
        expect(toggleModal).toHaveBeenCalledWith(false);
        expect(onUpdate).toHaveBeenCalled();
      });
    });
  });
});
