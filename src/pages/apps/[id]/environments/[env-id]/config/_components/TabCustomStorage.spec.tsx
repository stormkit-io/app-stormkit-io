import React from "react";
import type { RenderResult } from "@testing-library/react";
import { waitFor, fireEvent, getByText, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockApp from "~/testing/data/mock_app";
import mockEnv from "~/testing/data/mock_environment";
import {
  mockSetCustomStorage,
  mockUnsetCustomStorage,
} from "~/testing/nocks/nock_environment";
import TabCustomStorage from "./TabCustomStorage";

interface Props {
  app: App;
  env: Environment;
  setRefreshToken: jest.Mock;
}

describe("~/pages/apps/[id]/environments/[env-id]/config/_components/TabCustomStorage.tsx", () => {
  let wrapper: RenderResult;
  let currentApp: App;
  let currentEnv: Environment;
  let setRefreshToken: jest.Mock;

  const selectIntegration = (name: string) => {
    fireEvent.mouseDown(wrapper.getByText(/Choose an integration/));
    fireEvent.click(getByText(document.body, name));
  };

  const createWrapper = ({ app, env, setRefreshToken }: Props) => {
    wrapper = render(
      <TabCustomStorage
        app={app}
        environment={env}
        setRefreshToken={setRefreshToken}
      />
    );
  };

  const config = {
    integration: "bunny_cdn" as Integration,
    externalUrl: "https://yoyo.b-cdn.net",
    settings: {
      STORAGE_KEY: "123-abc",
      STORAGE_ZONE: "stormkit-react",
    },
  };

  describe("remove config", () => {
    beforeEach(() => {
      currentApp = mockApp();
      currentEnv = mockEnv({ app: currentApp });
      currentEnv.customStorage = config;
      setRefreshToken = jest.fn();
      createWrapper({ app: currentApp, env: currentEnv, setRefreshToken });
    });

    test("should unset the config", async () => {
      const scope = mockUnsetCustomStorage({
        appId: currentApp.id,
        envId: currentEnv.id!,
      });

      fireEvent.click(wrapper.getByText("Remove"));

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
        expect(wrapper.getByText(/Choose an integration/)).toBeTruthy();
      });
    });
  });

  describe("bunny cdn", () => {
    beforeEach(() => {
      currentApp = mockApp();
      currentEnv = mockEnv({ app: currentApp });
      setRefreshToken = jest.fn();
      createWrapper({ app: currentApp, env: currentEnv, setRefreshToken });
    });

    test("should submit the form properly", async () => {
      const scope = mockSetCustomStorage({
        appId: currentApp.id,
        envId: currentEnv.id!,
        config,
      });

      selectIntegration("Bunny CDN");

      await userEvent.type(
        wrapper.getByLabelText("External URL"),
        config.externalUrl
      );
      await userEvent.type(
        wrapper.getByLabelText("Storage zone"),
        config.settings.STORAGE_ZONE
      );
      await userEvent.type(
        wrapper.getByLabelText("Storage key"),
        config.settings.STORAGE_KEY
      );

      expect(
        wrapper.getByText("Submit").closest("button")!.getAttribute("disabled")
      ).toBe(null);

      fireEvent.submit(wrapper.getByText("Submit"));

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
        expect(
          "Custom storage configuration saved successfully. Your app will now be served from your custom storage."
        );
      });
    });

    test("should not submit the form when the url is wrong", async () => {
      selectIntegration("Bunny CDN");

      await userEvent.type(
        wrapper.getByLabelText("External URL"),
        "invalid-url"
      );

      expect(
        wrapper.getByText("Submit").closest("button")!.getAttribute("disabled")
      ).toBe(null);

      fireEvent.submit(wrapper.getByText("Submit"));

      await waitFor(() => {
        expect(
          wrapper.getByText(
            "Invalid URL provided. Please provide a valid URL, including the protocol. e.g. https://www.stormkit.io"
          )
        ).toBeTruthy();
      });
    });

    test("should not contain a remove button when there is no config", () => {
      expect(() => wrapper.getByText("Remove")).toThrow();
    });
  });
});
