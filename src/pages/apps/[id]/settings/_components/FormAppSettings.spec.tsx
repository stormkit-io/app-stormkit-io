import type { RenderResult } from "@testing-library/react";
import type { AppSettings } from "../types";
import React from "react";
import { waitFor, fireEvent, render } from "@testing-library/react";
import mockApp from "~/testing/data/mock_app";
import { mockUpdateSettings } from "~/testing/nocks/nock_update_settings";
import FormAppSettings from "./FormAppSettings";

interface Props {
  app: App;
  additionalSettings: AppSettings;
}

describe("~/pages/apps/[id]/settings/_components/FormAppSettings", () => {
  let currentApp: App;
  let wrapper: RenderResult;
  let onUpdate: jest.Mock;

  const createWrapper = ({ app, additionalSettings }: Props) => {
    onUpdate = jest.fn();
    wrapper = render(
      <FormAppSettings
        app={app}
        additionalSettings={additionalSettings}
        onUpdate={onUpdate}
      />
    );
  };

  beforeEach(() => {
    currentApp = mockApp();
    createWrapper({
      app: currentApp,
      additionalSettings: { envs: [], runtime: "nodejs16.x" },
    });
  });

  test("have the form prefilled", async () => {
    await waitFor(() => {
      expect(wrapper.getByDisplayValue(currentApp.displayName)).toBeTruthy();
      expect(
        wrapper.getByDisplayValue("https://gitlab.com/stormkit-io/frontend.git")
      ).toBeTruthy();
      expect(wrapper.getByText("NodeJS 16.x")).toBeTruthy();
    });
  });

  test("updates the settings", async () => {
    const scope = mockUpdateSettings({
      payload: {
        appId: currentApp.id,
        displayName: currentApp.displayName,
        repo: currentApp.repo,
        runtime: "nodejs16.x",
      },
      response: { ok: true },
    });

    fireEvent.click(wrapper.getByText("Update"));

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(onUpdate).toHaveBeenCalled();
    });
  });
});
