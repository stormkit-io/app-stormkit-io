import { fireEvent, RenderResult } from "@testing-library/react";
import React from "react";
import { render, waitFor } from "@testing-library/react";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import mockApp from "~/testing/data/mock_app";
import mockEnvironment from "~/testing/data/mock_environment";
import mockFeatureFlags from "~/testing/data/mock_feature_flags";
import {
  mockFetchFeatureFlags,
  mockUpsertFeatureFlags,
  mockDeleteFeatureFlags,
} from "~/testing/nocks/nock_feature_flags";
import FeatureFlags from "./FeatureFlags";

interface Props {
  app: App;
  env: Environment;
}

describe("~/pages/apps/[id]/environments/[env-id]/feature-flags/FeatureFlags.spec.tsx", () => {
  let wrapper: RenderResult;
  let currentApp: App;
  let currentEnv: Environment;
  let flags: FeatureFlag[];

  const createWrapper = ({ app, env }: Props) => {
    wrapper = render(
      <AppContext.Provider
        value={{
          app,
          environments: [env],
          setRefreshToken: jest.fn(),
        }}
      >
        <EnvironmentContext.Provider value={{ environment: env }}>
          <FeatureFlags />
        </EnvironmentContext.Provider>
      </AppContext.Provider>
    );
  };

  describe("with feature flags", () => {
    beforeEach(() => {
      currentApp = mockApp();
      currentEnv = mockEnvironment({ app: currentApp });
      flags = mockFeatureFlags();

      mockFetchFeatureFlags({
        appId: currentApp.id,
        envId: currentEnv.id!,
        response: flags,
      });

      createWrapper({ app: currentApp, env: currentEnv });
    });

    test("should contain a button to open feature flags modal", async () => {
      await fireEvent.click(wrapper.getByText("New feature flag"));
      await waitFor(() => {
        expect(wrapper.getByText("Create feature flag")).toBeTruthy();
      });
    });

    test("should list feature flags", async () => {
      expect(wrapper.container.innerHTML).toContain("spinner");
      expect(flags.length).toBe(2);

      flags.forEach(async ({ flagName }, i) => {
        await waitFor(() => {
          expect(wrapper.getByText(flagName)).toBeTruthy();
          expect(
            wrapper.getAllByText("When enabled access through").at(i)
          ).toBeTruthy();
          expect(wrapper.getAllByTestId("ff-code").at(i)?.textContent).toBe(
            `window.sk.features["${flagName}"]`
          );
        });
      });
    });

    test("should handle updating state", async () => {
      await waitFor(() => {
        expect(wrapper.getByText(flags[0].flagName)).toBeTruthy();
      });

      const upsertScope = mockUpsertFeatureFlags({
        appId: currentApp.id,
        envId: currentEnv.id!,
        flagName: flags[0].flagName,
        flagValue: !flags[0].flagValue,
      });

      fireEvent.click(
        wrapper.getByLabelText(`Toggle ${flags[0].flagName} state`)
      );

      await waitFor(() => {
        expect(wrapper.getByText("Yes, continue")).toBeTruthy();
      });

      fireEvent.click(wrapper.getByText("Yes, continue"));

      await waitFor(() => {
        expect(upsertScope.isDone()).toBe(true);
      });
    });

    test("should handle deleting feature flag", async () => {
      await waitFor(() => {
        expect(wrapper.getByText(flags[0].flagName)).toBeTruthy();
      });

      const deleteScope = mockDeleteFeatureFlags({
        appId: currentApp.id,
        envId: currentEnv.id!,
        flagName: flags[0].flagName,
      });

      fireEvent.click(wrapper.getAllByLabelText("expand").at(0)!);

      await waitFor(() => {
        expect(wrapper.getByText("Delete")).toBeTruthy();
      });

      fireEvent.click(wrapper.getByText("Delete"));

      await waitFor(() => {
        expect(wrapper.getByText("Yes, continue")).toBeTruthy();
      });

      fireEvent.click(wrapper.getByText("Yes, continue"));

      await waitFor(() => {
        expect(deleteScope.isDone()).toBe(true);
        expect(() => wrapper.getByText(flags[0].flagName)).toThrow();
      });
    });
  });

  describe("without feature flags", () => {
    beforeEach(() => {
      currentApp = mockApp();
      currentEnv = mockEnvironment({ app: currentApp });

      mockFetchFeatureFlags({
        appId: currentApp.id,
        envId: currentEnv.id!,
        response: [],
      });

      createWrapper({ app: currentApp, env: currentEnv });
    });

    test("should display an empty list", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("It is quite empty here.")).toBeTruthy();
      });
    });
  });
});
