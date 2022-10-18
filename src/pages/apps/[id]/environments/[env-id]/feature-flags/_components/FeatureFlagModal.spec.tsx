import type { RenderResult } from "@testing-library/react";
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockApp from "~/testing/data/mock_app";
import mockEnvironment from "~/testing/data/mock_environment";
import { mockUpsertFeatureFlags } from "~/testing/nocks/nock_feature_flags";
import FeatureFlagModal from "./FeatureFlagModal";

interface Props {
  app: App;
  env: Environment;
}

describe("~/pages/apps/[id]/environments/[env-id]/feature-flags/FeatureFlags.spec.tsx", () => {
  let wrapper: RenderResult;
  let currentApp: App;
  let currentEnv: Environment;
  let closeModal: jest.Mock;
  let setReload: jest.Mock;

  const createWrapper = ({ app, env }: Props) => {
    setReload = jest.fn();
    closeModal = jest.fn();

    wrapper = render(
      <FeatureFlagModal
        app={app}
        environment={env}
        closeModal={closeModal}
        setReload={setReload}
      />
    );
  };

  beforeEach(() => {
    currentApp = mockApp();
    currentEnv = mockEnvironment({ app: currentApp });
    createWrapper({ app: currentApp, env: currentEnv });
  });

  test("should insert a feature flag", async () => {
    const scope = mockUpsertFeatureFlags({
      appId: currentApp.id,
      envId: currentEnv.id!,
      flagName: "myFeatureFlag",
      flagValue: false,
    });

    expect(wrapper.getByText("Create feature flag")).toBeTruthy();

    await userEvent.type(wrapper.getByLabelText("Flag name"), "myFeatureFlag");
    await fireEvent.click(wrapper.getByText("Create"));

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
    });
  });
});
