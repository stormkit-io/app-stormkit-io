import type { RenderResult } from "@testing-library/react";
import React from "react";
import { waitFor, fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockApp from "~/testing/data/mock_app";
import { mockDeleteApp } from "~/testing/nocks/nock_app";
import FormDangerZone from "./FormDangerZone";

interface Props {
  app: App;
}

describe("~/pages/apps/[id]/settings/_components/FormDangerZone", () => {
  let currentApp: App;
  let wrapper: RenderResult;

  const createWrapper = ({ app }: Props) => {
    wrapper = render(<FormDangerZone app={app} />);
  };

  beforeEach(() => {
    currentApp = mockApp();
    createWrapper({ app: currentApp });
  });

  test("displays a warning message", async () => {
    await waitFor(() => {
      expect(
        wrapper.getByText(/Deleting an application will remove/)
      ).toBeTruthy();
    });
  });

  test("clicking Remove application should call the confirm action", async () => {
    await fireEvent.click(wrapper.getByText("Remove application"));

    const modal = wrapper.getByText(
      "This will completely remove the application. All associated files and endpoints will be gone. Remember there is no going back from here."
    );

    expect(modal).toBeTruthy();

    await userEvent.type(
      modal.parentNode!.querySelector("input")!,
      "permanently delete application"
    );

    const scope = mockDeleteApp({
      appId: currentApp.id,
      response: { ok: true },
    });

    await fireEvent.click(wrapper.getByText("Yes, continue"));

    Object.defineProperty(window, "location", {
      value: {
        assign: jest.fn(),
      },
    });

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(window.location.assign).toHaveBeenCalledWith("/");
    });
  });
});
