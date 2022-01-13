import router from "react-router";
import { waitFor, fireEvent, getByText } from "@testing-library/react";
import { withMockContext } from "~/testing/helpers";
import * as data from "~/testing/data";
import * as nocks from "~/testing/nocks";

const fileName =
  "pages/apps/[id]/settings/_components/FormNewOutboundWebhookModal";

describe(fileName, () => {
  const path = `~/${fileName}`;
  let app;
  let wrapper;
  let historySpy;
  let toggleModalSpy;

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

  test("displays a simple form initially", () => {
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

  test("displays request headers when enabled", () => {
    fireEvent.click(wrapper.getByLabelText("Enable request headers"));
    expect(wrapper.getByLabelText(/Request headers/)).toBeTruthy();
  });

  test("displays request payload when request method is POST", () => {
    fireEvent.mouseDown(wrapper.getByLabelText(/Request method/));
    expect(getByText(document.body, "Post")).toBeTruthy();
    fireEvent.click(getByText(document.body, "Post"));
    expect(wrapper.getByLabelText(/Request payload/)).toBeTruthy();
  });

  test("submits the form request", async () => {
    const scope = nocks.mockCreateOutboundWebhooks({
      app,
      hook: {
        requestUrl: "",
        requestMethod: "GET",
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
